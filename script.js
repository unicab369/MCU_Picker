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
					const background = e.pinMux_colors[index] || '#888';
					return `<div class="pinMux-style" style="width: ${width}px; background: ${background};">
						${e.pinMux[index] || ''}
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

//# Load pin data from JSON file
async function loadPinData() {
	try {
		const pinData = await fetch('pins.json').then(response => response.json());
		leftPins = pinData.left_pins;
		rightPins = pinData.right_pins;
		renderPins(leftPins, 'left');
		renderPins(rightPins, 'right');
	} catch (error) {
		console.error('Error loading pin data:', error);
	}
}

//# Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
	loadPinData();
});