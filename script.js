let leftPins = [];
let rightPins = [];

// Store selected options globally
const selectedOptions = {'CH32': ['CH32V003-J4M6', 'CH32V003-F4U6'], 'CH32_': ['CH32V203-F6P6']}


let currentActiveTarget = 'CH32' // Set default
let mcu_models = {}
let pins_config = {}
let selectedLegends = {}

function onSelectPin(side, currentLabel) {
	const newLabel = prompt("Enter new label for " + currentLabel + ":")
	if (!newLabel) return;
	// const target = (side === 'left') ? leftPins : rightPins;
	// const element = target.list.find(p => p.label === currentLabel);
	// if (element) element.label = newLabel;
	// renderPins(target, side);
}

//# Render the left and right pins for a given model
function renderPinList(pinsMap, model, side) {
	const pinStackSide = (side === 'left') ? 'flex-end' : 'flex-start'
	
	return model.pin_list.map(item => {
		const target = pinsMap[item.label]

		const pinStackHTML =
			`<div class="pinMux-outline" style="justify-content: ${ pinStackSide }">
				${ !target ? '' : target?.map(e=> {
					return `<div class="pinMux-style" style="width: 60px; background: ${e.color};">
						${e.label}
					</div>`
				}) }
			</div>`
			
		const labelStyleStr = `background: ${item.label_background || model.label_background || 'green'};
							width: ${ model.label_width || 40 }px;
							color: ${ item.color || model.label_color || 'black' };
							padding: 2px; margin: 0 5px;
							text-align: center;`;
		const labelHTML = `<div style="${labelStyleStr}">${item.label}</div>`

		// change pin outline color by adding "outline_color" value in json
		return `<div class="pin" style="background:${item.outline_color || 'white'};"
					onclick="onSelectPin('${side}', '${item.label}')">
				${ (side === 'left') ? (pinStackHTML + labelHTML) : (labelHTML + pinStackHTML) }
			</div>`
	}).join("")
}

//# Load pin data from JSON file
async function reload_MCUsContainer() {
	try {
		// selectedLegends = Object.keys(pins_config.legend_names)
		// console.log("selectedLegends: ", selectedLegends)

		var htmlOutput = ""

		//# Loop through and make diagram for each targeted MCU
		for (const family of Object.keys(selectedOptions)) {
			const target = await fetch(`json_models/model_${family}.json`).then(response => response.json())
			console.log("target: ", target)

			const pinsMap = {}

			const obj = mcu_models[family].pin_list
			console.log("Obj: ", obj)

			if (obj) {
				for (const pin_key of Object.keys(obj)) {
					for (func_key of selectedLegends[family]) {
						const label = obj[pin_key][func_key]
						if (!label) continue
						const color = pins_config.legend_colors[func_key]
						
						if (pin_key in pinsMap) {
							pinsMap[pin_key].push({label, color})
						} else {
							pinsMap[pin_key] = [{label, color}]
						}
					}
				}
			}

			console.log("pinsMap: ", pinsMap)

			// Add header
			if (selectedOptions[family].length > 0) {
				htmlOutput += `<br><div style="font-weight: bold; width: 100%; height: 50px; background: lightgray;
					display: flex; align-items: center; justify-content: center;">${family}</div>`
			}

			// Add Diagram
			selectedOptions[family].forEach(e => {
				const model = target[e]
				console.log(`key: ${e}`)
				console.log("model: ", model)

				if (model && model.left_pins && model.right_pins) {
					htmlOutput += `
						<br>
						<div style="width: 100%; overflow-x: auto;">
							<div style="width: 100%; text-align: center; font-weight: bold; height: 20px;">${e}</div>
							<div class="mcu-outline">
								<div class="pins-outline">${renderPinList(pinsMap, model.left_pins, 'left')}</div>
								<div class="mcu" style="min-width: 120px;">
									<div>(${model.package})</div>
								</div>
								<div class="pins-outline">${renderPinList(pinsMap, model.right_pins, 'right')}</div>
							</div>
						</div>`;
				}
				else {
					htmlOutput += `<div">No pins data found for ${e}</div><br>`;
				}
			})

			// Add Legend
			if (selectedOptions[family].length > 0) {
				htmlOutput += `<br><div style="display: flex; flex-wrap: wrap; justify-content: center;
									gap: 2rem;" id="legendContainer_${family}"></div>`
			}
		}
		
		document.getElementById('MCUsContainer').innerHTML = htmlOutput + `<br>`

		//# Reload legend
		for (const family of Object.keys(selectedOptions)) {
			reload_legendContainer(family)
		}

	} catch (error) {
		console.error('Error loading JSON files:', error)
	}
}


function onSelectLegend(family, func_key) {
	if (func_key == "VDD" || func_key == "VSS") return;
	
	const idx = selectedLegends[family].indexOf(func_key)
	if (idx === -1) selectedLegends[family].push(func_key)
	else selectedLegends[family].splice(idx, 1)

	reload_MCUsContainer()
}

//# load legend
function reload_legendContainer(family) {
	const sections = []
	const columns = []

	for (key in mcu_models[family].legends) {
		const color = selectedLegends[family].includes(key) ? pins_config.legend_colors[key] : '#888'

		sections.push(
			`<div style="display: flex; align-items: center; gap: 0.75rem;">
				<div style="background: ${color}; padding: 0 5px; width: 60px; text-align: center" 
					onclick="onSelectLegend('${family}', '${key}')">
					${key}
				</div>
				<div">${ mcu_models[family].legends[key] }</div>
			</div>`
		)

		if (sections.length === 4) {
			columns.push(
				`<section style="display: flex; flex-direction: column; gap: 0.5rem; width: 200px;">
					${sections.join('')}
				</section>`
			)
			sections.length = 0
		}		
	}

	// get the remaining columns incase there are less than 4
	if (sections.length > 0) {
		columns.push(
			`<section style="display: flex; flex-direction: column; gap: 0.5rem; width: 200px;">
				${sections.join('')}
			</section>`
		)
	}

	const legendContainer = document.getElementById('legendContainer_' + family)
	if (legendContainer) legendContainer.innerHTML = columns.join('')
}


//# load table
function reload_tableContainer(key) {
	const headers = ["#", "Part No.", "Freq.", "Flash", "RAM", "GPIO", "V-Min", "V-Max",
						"UART", "I2C", "SPI", "RTC", "I2S", "CAN", "USB2.0", "Package"]
	const headerKeys = ["idx", "name", "frequency_MHz", "Flash_K", "SRAM_K", "GPIO", "Min_V", "Max_V",
						"UART", "I2C", "SPI", , "RTC", "I2S", "CAN", "USB2", "package"]
	const heardersHTML = headers.map(e => `<th>${e}</th>`).join('')
	
	const recordHTML = mcu_models[key].mcu_list.map((e, record_idx) => {
		const backgroundColor = record_idx % 2 === 0 ? 'lightgray' : '#f7f7f7'
		const topBorder = e.separator ? 'border-top: 3px solid gray;' : ''

		return `
			<tr style="background-color: ${backgroundColor}; ${topBorder}">${
				headerKeys.map((key, key_idx) => {
					if (key_idx === 0) { return `<td>${record_idx + 1}</td>` }

					// add subfix
					const subfix = key.includes('_') ? `${key.split('_')[1]}` : ''
					const value = e[key] || '';
					return `<td>${value + subfix}</td>`
				}).join('')}
			</tr>`
	})

	document.getElementById('tableContainer').innerHTML = `
		<div style="overflow-x: auto; border: 1px solid #dee2e6; height: 700px;">
			<table style="border-collapse: collapse; width: 100%;">
				<thead><tr>${heardersHTML}</tr></thead>
				<tbody>${recordHTML}</tbody>
			</table>
		</div>
		
		<style>
		    /* Sticky header */
			table th {
				position: sticky;
				top: 0;
				background: #f8f9fa;
				z-index: 20;
				border-bottom: 2px solid #dee2e6;
				padding: 12px;
			}

			table th, table td {
				border: 1px solid #dee2e6;
				padding: 8px 8px;
				white-space: nowrap;
			}
			
			/* Freeze first two columns with auto positioning */
			table th:first-child, table td:first-child {
				position: sticky;
				left: 0;
				background: inherit;
			}
			
			table th:nth-child(2), table td:nth-child(2) {
				position: sticky;
				left: 30px;
				background: inherit;
			}
		</style>`
}


function tabs_items() {
	return document.querySelectorAll('#mcuTabs .tab-item')
}

//! START_POINT: Initialize when the page loads
document.addEventListener('DOMContentLoaded', async function() {
	//# load MCUs json
	try {
		[mcu_models, pins_config] = await Promise.all([
			fetch('json_models/model_MCUs.json').then(response => response.json()),
			fetch('pins_config.json').then(response => response.json())
		])
		console.log("mcu_models: ", mcu_models);
		console.log("pins_config: ", pins_config);
		console.log("tabItems: ", tabs_items);

		let mcuTabsHTML = ''

		for (model in mcu_models) {
			console.log("model3: ", model);
			selectedLegends[model] = Object.keys(mcu_models[model].legends || [])
			mcuTabsHTML += 
				`<li class="tab-item">
					<a href="#" onclick="onSwitch_tab(event, '${model}')">${model}xx</a>
				</li>`
		}

		document.getElementById('mcuTabs').innerHTML = mcuTabsHTML

		await reload_MCUsContainer()
		reload_tableContainer('CH32')

		// Set first tab as active manually
		tabs_items()[0].classList.add('active')

		// Then call the function
		onSwitch_tab({ 
			preventDefault: () => {},
			currentTarget: tabs_items()[0].querySelector('a') // select <a>
		}, 'CH32')

	} catch (error) {
		console.error('Error loading data:', error)
	}
});

async function onApply_mcuSelections() {
    // Save the current tab one last time
    if (currentActiveTarget) {
        const checkboxes = document.querySelectorAll(`input[name="${currentActiveTarget}_nameId"]:checked`)
        selectedOptions[currentActiveTarget] = Array.from(checkboxes).map(cbox => cbox.value)
    }

	await reload_MCUsContainer()
    console.log("selectedOptions: ", selectedOptions)
}

async function onSwitch_tab(event, target_str) {
    event?.preventDefault()
    
    // 1. Save CURRENT tab's selections
    if (currentActiveTarget !== target_str) onApply_mcuSelections()
    
    // 2. Switch tabs and update current target
    tabs_items().forEach(t => t.classList.remove('active'))
    event?.currentTarget?.parentElement.classList.add('active')
    currentActiveTarget = target_str; // Update the current target

    // 3. Generate content for the NEW tab
    const options = mcu_models[target_str].mcu_list.map(e2 => {
        const isChecked = selectedOptions[target_str]?.includes(e2.part_no || e2.name) ? 'checked' : ''
        return `<div>
					<input type="checkbox"
						style="width: 22px; height: 22px;"
						name="${ target_str }_nameId"
						value="${ e2.part_no || e2.name }" ${ isChecked }>
					<i class="form-icon"></i> ${ e2.name }${ e2.part_no ? `-${ e2.part_no }` : ''}
				</div>`;
			}).join('');

    document.getElementById('modalContent').innerHTML = `
        <p>Content for ${target_str} microcontrollers.</p>
        <div class="form-group">
            <div class="checkbox-group">
                ${options}
            </div>
        </div>`
}


function w3_open() {
	document.getElementById("mySidebar").style.display = "block"
	document.getElementById("myOverlay").style.display = "block"
}

function w3_close() {
	document.getElementById("mySidebar").style.display = "none"
	document.getElementById("myOverlay").style.display = "none"
}