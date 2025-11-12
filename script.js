let leftPins = [];
let rightPins = [];

//# render pins dynamically with sub-pins on the right
function renderPins(pinsModel, side) {
	// html id: leftPins, rightPins
	document.getElementById(side + '_pins').innerHTML = pinsModel.list.map(e => {		
		const pinMuxJustify = (side === 'left') ? 'flex-end' : 'flex-start';
		
		const pinMuxHTML =
			`<div class="pinMux-outline" style="justify-content: ${pinMuxJustify}">
				${Array(pinsModel.pinMux_length).fill().map((_, index) => {
					const width = pinsModel.column_widths[index] || 30; // Use column_widths
					const background = e.pinMux_colors ? e.pinMux_colors[index] : '#888';
					return `<div class="pinMux-style" style="width: ${width}px; background: ${background};">
						${(e.pinMux && e.pinMux[index]) ? e.pinMux[index] : ''}
					</div>`
				}).join('')}
			</div>`;

		const labelStyleStr = `background: ${e.label_background || pinsModel.label_background || 'green'};
								width: ${pinsModel.label_width || 40}px;
								color: ${e.color || pinsModel.label_color || 'black'};
								padding: 2px; margin: 0 5px;
								text-align: center;`;
		const labelHTML = `<div style="${labelStyleStr}">${e.label}</div>`;

		// change pin outline color by adding "outline_color" value in json
		return `<div class="pin" style="background:${e.outline_color || 'white'};"
			onclick="editPin('${side}', '${e.label}')">
			${(side === 'left') ? pinMuxHTML + labelHTML :
								labelHTML + pinMuxHTML}
		</div>`;
	}).join("");
}

function editPin(side, currentLabel) {
	const newLabel = prompt("Enter new label for " + currentLabel + ":");
	if (!newLabel) return;
	const target = (side === 'left') ? leftPins : rightPins;
	const element = target.list.find(p => p.label === currentLabel);
	if (element) element.label = newLabel;
	renderPins(target, side);
}

// Store selected options globally
const selectedOptions = {};
let currentActiveTarget = 'CH32'; // Set default
let mcu_models = {};
const tabs_items = document.querySelectorAll('#mcuTabs .tab-item');

//! START_POINT: Initialize when the page loads
document.addEventListener('DOMContentLoaded', async function() {
	//# Load pin data from JSON file
	try {
		const pinData = await fetch('pins.json').then(response => response.json());
		leftPins = pinData.left_pins;
		rightPins = pinData.right_pins;
		renderPins(leftPins, 'left');
		renderPins(rightPins, 'right');
	} catch (error) {
		console.error('Error loading pin data:', error);
	}

	//# load MCUs json
	try {
		mcu_models = await fetch('mcu_jsons/model_MCUs.json').then(response => response.json());
		console.log("mcu_models: ", mcu_models);

		// Set first tab as active manually
		tabs_items[0].classList.add('active');

		// Then call the function
		onSwitch_tab({ 
			preventDefault: () => {},
			currentTarget: tabs_items[0].querySelector('a') // select <a>
		}, 'CH32');

	} catch (error) {
		console.error('Error loading mcu_models data:', error);
	}
});

function onApply_mcuSelections() {
    // Save the current tab one last time
    if (currentActiveTarget) {
        const checkboxes = document.querySelectorAll(`input[name="${currentActiveTarget}_nameId"]:checked`);
        selectedOptions[currentActiveTarget] = Array.from(checkboxes).map(cbox => cbox.value);
    }

    console.log("selectedOptions: ", selectedOptions);
}

function onSwitch_tab(event, target_str) {
    event?.preventDefault();
    
    // 1. Save CURRENT tab's selections
    if (currentActiveTarget !== target_str) onApply_mcuSelections();
    
    // 2. Switch tabs and update current target
    tabs_items.forEach(t => t.classList.remove('active'));
    event?.currentTarget?.parentElement.classList.add('active');
    currentActiveTarget = target_str; // Update the current target

    // 3. Generate content for the NEW tab
    const options = mcu_models[target_str+'_MCUs'].list.map(e2 => {
        const isChecked = selectedOptions[target_str]?.includes(e2.part_no || e2.name) ? 'checked' : '';
        return `
            <label class="form-checkbox">
                <input type="checkbox" name="${target_str}_nameId" value="${e2.part_no || e2.name}" ${isChecked}>
                <i class="form-icon"></i> ${e2.name}${e2.part_no ? `-${e2.part_no}` : ''}
            </label>`;
    }).join('');

    document.getElementById('modalContent').innerHTML = `
        <p>Content for ${target_str} microcontrollers.</p>
        <div class="form-group">
            <label class="form-label">Select Models:</label>
            <div class="checkbox-group">
                ${options}
            </div>
        </div>`;
}


function w3_open() {
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("myOverlay").style.display = "none";
}