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
					return `<div class="pinMux-style" style="width: 70px; background: ${e.color};">
						${e.label}
					</div>`
				}).join('') }
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
		var htmlOutput = ""

		//# Loop through and make diagram for each targeted MCU
		for (const family of Object.keys(selectedOptions)) {
			const target = await fetch(`json_mcu/model_${family}.json`).then(response => response.json())
			console.log("target: ", target)

			const p_list = mcu_models[family].pin_list
			const selected_legends = selectedLegends[family]
			const dma_chans= mcu_models[family].dma_channels
			const pinsMap = {}

			console.log("selected_legends: ", selected_legends)

			for (const pin_key in p_list) {
				for (func_key of selected_legends) {
					const label = p_list[pin_key][func_key]
					if (!label) continue
					const color = pins_config.legend_colors[func_key]
					
					if (pin_key in pinsMap) {
						pinsMap[pin_key].push({label, color})
					} else {
						pinsMap[pin_key] = [{label, color}]
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
			selectedOptions[family].forEach(name => {
				const model = target[name]
				if (!model) return

				if (model.left_pins && model.right_pins) {
					htmlOutput += `
						<br>
						<div style="width: 100%; overflow-x: auto;">
							<div style="width: 100%; text-align: center; font-weight: bold; height: 20px;">
								${name}
							</div>
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
					htmlOutput += `<br><div style="text-align: center;">No pins data found for ${name}</div><br>`;
				}
			})

			// Add Legend
			if (selectedOptions[family].length > 0) {
				htmlOutput += `<br><div style="display: flex; flex-wrap: wrap; justify-content: center;
									gap: 2rem;" id="legendContainer_${family}"></div>`
			}

			let dma_HTML = ''
			const dma_map = {}

			for (const chan in dma_chans) {
				const targets = dma_chans[chan]

				for (func_key of selected_legends) {
					const label = dma_chans[chan][func_key]
					if (!label) continue
					const color = pins_config.legend_colors[func_key]

					if (chan in dma_map) {
						dma_map[chan].push({label, color})
					} else {
						dma_map[chan] = [{label, color}]
					}
				}
			}

			console.log("dma_map: ", dma_map)

			Object.keys(dma_map).map(e => {
				dma_HTML += `<div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
						<div style="min-width: 50px; font-weight: bold;">${e}</div>
						<div style="display: flex; gap: 5px; flex-wrap: nowrap; padding: 5px;">
						${
							dma_map[e].map(t => {
								return `<div class="pinMux-style" style="width: 70px; background: ${t.color}; flex-shrink: 0;">
									${t.label}
								</div>`
							}).join('')
						}
					</div>
				</div>`
			})

			// add DMA channels
			htmlOutput += `<br><div style="overflow-x: auto; padding: 10px;">
								${ dma_HTML }
							</div>`
		}
		
		document.getElementById('MCUs_container').innerHTML = htmlOutput + `<br>`

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
	const legend_models = mcu_models[family].legends

	// show different number or rows depending of the number of legends
	const row_count = Object.keys(legend_models).length > 16 ? 6 : 4

	for (key in legend_models) {
		const color = selectedLegends[family].includes(key) ? pins_config.legend_colors[key] : '#888'

		sections.push(
			`<div style="display: flex; align-items: center; gap: 0.75rem;">
				<div style="background: ${color}; padding: 0 5px; width: 60px; text-align: center; cursor: pointer;" 
					onclick="onSelectLegend('${family}', '${key}')">
					${key}
				</div>
				<div>${ legend_models[key] }</div>
			</div>`
		)

		if (sections.length === row_count) {
			columns.push(
				`<section style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 200px; flex-shrink: 0;">
					${sections.join('')}
				</section>`
			)
			sections.length = 0
		}		
	}

	// get the remaining columns in case there are less than 4
	if (sections.length > 0) {
		columns.push(
			`<section style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 200px; flex-shrink: 0;">
				${sections.join('')}
			</section>`
		)
	}

	const legendContainer = document.getElementById('legendContainer_' + family)
	if (legendContainer) {
		legendContainer.innerHTML = `
			<div style="display: flex; gap: 1rem; overflow-x: auto; padding: 2px 0;">
				${columns.join('')}
			</div>`
	}
}


//# load table
function reload_tableContainer(key) {
	const headers = ["#", "Part No.", "Freq.", "Flash", "RAM", "GPIO", "V-Min", "V-Max",
						"UART", "I2C", "SPI", "RTC", "I2S", "CAN", "USB2.0", "Package"]
	const headerKeys = ["idx", "name", "frequency_MHz", "flash_K", "sram_K", "GPIO", "Min_V", "Max_V",
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

	document.getElementById('table_container').innerHTML = `
		<div style="overflow-x: auto; border: 1px solid black; height: 700px;">
			<table class="sticky-rows" style="border-collapse: collapse; width: 100%;">
				<thead><tr>${heardersHTML}</tr></thead>
				<tbody>${recordHTML}</tbody>
			</table>
		</div>`
}


function tabs_items() {
	return document.querySelectorAll('#mcuTabs .tab-item')
}


let ch32_regs = {}

function handle_regClick(key, subkey) {
	const reg = ch32_regs[key].registers[subkey]
	const headers = ["Bit", "Name", "Access", "Description", "Reset Value"]
	const keys = ["range", "name", "access", "info", "reset_value"]

	const generateRow = (row) => 
		`<tr>${keys.map((key, idx) => {
			let style = (idx === 0) ? 'text-align: center;' : ''
			if(key === 'info') style = 'white-space: normal; word-wrap: break-word;'
			return `<td style="${style}">${row[key]}</td>`;
		}).join('')}</tr>`;

	document.getElementById(`${key}_reg_container`).innerHTML = `
		<br>
		<input type="checkbox" style="width: 22px; height: 22px;" id="aa" name="aa_nameId" value="aa">
		<label for="aa" style="cursor: pointer;">View All</label>
		
		<br>
		<div style="font-weight: bold; font-size: 25px;">${reg.name}</div>

		<div style="overflow-x: auto;">
			<table style="border-collapse: collapse;">
				<thead><tr>${
					headers.map(h => `<th style="background-color: lightgray !important;">
										${h}
									</th>`).join('')
				}</tr></thead>
				<tbody>${
					reg.bits_fields.map(generateRow).join('')
				}</tbody>
			</table>
		</div>`;
}

//! START_POINT: Initialize when the page loads
document.addEventListener('DOMContentLoaded', async function() {
	//# load MCUs json
	try {
		[mcu_models, pins_config] = await Promise.all([
			fetch('json_mcu/model_MCUs.json').then(response => response.json()),
			fetch('pins_config.json').then(response => response.json())
		])
		console.log("mcu_models: ", mcu_models)
		console.log("pins_config: ", pins_config)
		console.log("tabItems: ", tabs_items)

		let mcuTabsHTML = ''

		for (model in mcu_models) {
			selectedLegends[model] = Object.keys(mcu_models[model].legends || [])
			mcuTabsHTML += 
				`<li class="tab-item">
					<a href="#" onclick="onSwitch_tab(event, '${ model }')">${ model }xx</a>
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


		const reg_headerKeys = ["Name", "Access Addr.", "Description", "Reset Value"]
		ch32_regs = await fetch('json_register/reg_CH32V003.json').then(response => response.json())
		let regTableHTML = ''

		for (const [key, value] of Object.entries(ch32_regs)) {
			regTableHTML += `
				<br>
				<div style="overflow-x: auto;">
					<table>
						<thead>
							<tr>${ reg_headerKeys.map(e => 
								`<th style="background-color: lightgray !important;">${e}</th>`).join('') 
							}</tr>
						</thead>
						<tbody>
							${ Object.entries(value.registers).map(([subkey, value]) => `
								<tr>
									<td>
										<a style="color: blue;" onclick="handle_regClick('${ key }', '${ subkey }')">
											${ subkey }
										</a>
									</td>
									<td>${ value.address }</td>
									<td>${ value.info }</td>
									<td>${ value.reset_value }</td>
								</tr>`).join('')
							}
						</tbody>
					</table>
				</div>
				
				<div id="${key}_reg_container"></div>
				`
		}

		document.getElementById('registers_container').innerHTML = regTableHTML

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

//# Render the content for a specific tab
async function onSwitch_tab(event, target_str) {
	event?.preventDefault()
	
	// 1. Save CURRENT tab's selections
	if (currentActiveTarget !== target_str) onApply_mcuSelections()
	
	// 2. Switch tabs and update current target
	tabs_items().forEach(t => t.classList.remove('active'))
	event?.currentTarget?.parentElement.classList.add('active')
	currentActiveTarget = target_str; // Update the current target

	// 3. Generate content for the NEW tab
	const options = mcu_models[target_str].mcu_list.map(mcu => {
		const isChecked = selectedOptions[target_str]?.includes(mcu.name) ? 'checked' : ''
		const inputId = `${ target_str }_${ mcu.name }` // Unique ID for each checkbox
		const description = `(${ mcu.frequency_MHz}MHz, ${mcu.flash_K}K Flash, 
							${mcu.sram_K}K RAM, ${mcu.package })`

		// return each of the mcu in the list
		return `<div style="height: 35px; display: flex; align-items: center; gap: 10px;">
					<input type="checkbox" style="width: 22px; height: 22px;"
						id="${ inputId }"
						name="${ target_str }_nameId"
						value="${ mcu.name }" ${ isChecked }>
					<label for="${ inputId }" style="cursor: pointer; flex-shrink: 0;">
						${ mcu.name }
					</label>
					<div style="color: gray; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
						${ description }
					</div>
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