let leftPins = [];
let rightPins = [];

function onSelectPin(side, currentLabel) {
	const newLabel = prompt("Enter new label for " + currentLabel + ":");
	if (!newLabel) return;
	// const target = (side === 'left') ? leftPins : rightPins;
	// const element = target.list.find(p => p.label === currentLabel);
	// if (element) element.label = newLabel;
	// renderPins(target, side);
}


function renderPinList(model, side, pin_functions) {
	const pinMuxJustify = (side === 'left') ? 'flex-end' : 'flex-start';
	
	return model.pin_list.map(e => {
		const pinMuxHTML =
		`<div class="pinMux-outline" style="justify-content: ${pinMuxJustify}">
			${Array(model.pinMux_length).fill().map((_, index) => {
				const width = model.column_widths[index] || 30; // Use column_widths
				const pinLabel = (e.pinMux && e.pinMux[index]) ? e.pinMux[index] : '';
				const pinFunc = e.pin_functions ? e.pin_functions[index] : '';
				const pinBackground = pin_functions[pinFunc] || '#888';

				return `<div class="pinMux-style" style="width: ${width}px; background: ${pinBackground};">
					${pinLabel}
				</div>`
			}).join('')}
		</div>`;

		const labelStyleStr = `background: ${e.label_background || model.label_background || 'green'};
								width: ${model.label_width || 40}px;
								color: ${e.color || model.label_color || 'black'};
								padding: 2px; margin: 0 5px;
								text-align: center;`;
		const labelHTML = `<div style="${labelStyleStr}">${e.label}</div>`;

		// change pin outline color by adding "outline_color" value in json
		return `<div class="pin" style="background:${e.outline_color || 'white'};"
			onclick="onSelectPin('${side}', '${e.label}')">
			${(side === 'left') ? pinMuxHTML + labelHTML :
								labelHTML + pinMuxHTML}
		</div>`;
	}).join("");
}


// Store selected options globally
const selectedOptions = {'CH32': ['CH32V003-J4M6', 'CH32V003-A4M6', 'CH32V003-F4P6', 'CH32V003-F4U6']};
let currentActiveTarget = 'CH32'; // Set default
let mcu_models = {};
const tabs_items = document.querySelectorAll('#mcuTabs .tab-item');
let app_config = {};

async function reloadData() {
	//# Load pin data from JSON file
	try {
		const data_models = {};
		for (const key of Object.keys(selectedOptions)) {
			const response = await fetch(`mcu_jsons/model_${key}.json`);
			data_models[key] = await response.json();
		}
		console.log("data_models: ", data_models);

		var htmlOutput = "";

		Object.keys(selectedOptions).forEach((key, index) => {
			const target = data_models[key];
			console.log("target: ", target);

			htmlOutput += `<div style="font-weight: bold; width: 100%; height: 50px; background: lightgray;
				display: flex; align-items: center; justify-content: center;">${key}</div>`;

			selectedOptions[key].forEach(e => {
				const model = data_models[key][e];
				console.log(`key: ${e}`);
				console.log("model: ", model);

				if (model && model.left_pins && model.right_pins) {
					htmlOutput += `
						<div style="width: 100%; overflow-x: auto;">
							<div class="mcu-outline">
								<div class="pins-outline">${renderPinList(model.left_pins, 'left', app_config.pin_functions)}</div>
								<div class="mcu" style="width: 400px;">
									<div>${e}</div>
									<div>(${model.package})</div>
								</div>
								<div class="pins-outline">${renderPinList(model.right_pins, 'right', app_config.pin_functions)}</div>
							</div>
						</div><br>`;
				}
				else {
					htmlOutput += `<div">No pins data found for ${e}</div><br>`;
				}
			})	
		});

		document.getElementById('MCUs-display-area').innerHTML = htmlOutput;

	} catch (error) {
		console.error('Error loading JSON files:', error);
	}
}

//! START_POINT: Initialize when the page loads
document.addEventListener('DOMContentLoaded', async function() {
	//# load MCUs json
	try {
		[mcu_models, app_config] = await Promise.all([
			fetch('mcu_jsons/model_MCUs.json').then(response => response.json()),
			fetch('app_config.json').then(response => response.json())
		])
		// mcu_models = await fetch('mcu_jsons/model_MCUs.json').then(response => response.json());
		console.log("mcu_models: ", mcu_models);
		console.log("app_config: ", app_config);

		// Set first tab as active manually
		tabs_items[0].classList.add('active');

		// Then call the function
		onSwitch_tab({ 
			preventDefault: () => {},
			currentTarget: tabs_items[0].querySelector('a') // select <a>
		}, 'CH32');

		reloadData();

	} catch (error) {
		console.error('Error loading mcu_models data:', error);
	}
});

async function onApply_mcuSelections() {
    // Save the current tab one last time
    if (currentActiveTarget) {
        const checkboxes = document.querySelectorAll(`input[name="${currentActiveTarget}_nameId"]:checked`);
        selectedOptions[currentActiveTarget] = Array.from(checkboxes).map(cbox => cbox.value);
    }

	await reloadData();
    console.log("selectedOptions: ", selectedOptions);
}

async function onSwitch_tab(event, target_str) {
    event?.preventDefault();
    
    // 1. Save CURRENT tab's selections
    if (currentActiveTarget !== target_str) onApply_mcuSelections();
    
    // 2. Switch tabs and update current target
    tabs_items.forEach(t => t.classList.remove('active'));
    event?.currentTarget?.parentElement.classList.add('active');
    currentActiveTarget = target_str; // Update the current target

    // 3. Generate content for the NEW tab
    const options = mcu_models[target_str].list.map(e2 => {
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