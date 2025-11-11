let leftPins = [];
let rightPins = [];
let leftColumnWidths = [];
let rightColumnWidths = [];

//# render pins dynamically with sub-pins on the right
function renderPins(pinsModel, side) {
	// html id: leftPins, rightPins
    document.getElementById(side + 'Pins').innerHTML = pinsModel.list.map(pin => {
        const labelHTML = `<div>${pin.label}</div>`;
        const subPinsJustify = (side === 'left') ? 'flex-end' : 'flex-start';
        
        // Always create 5 slots with fixed widths from column_widths
        const subPinsSlots = Array(5).fill().map((_, index) => {
            const subPin = pin.subPins ? pin.subPins[index] : null;
            const width = pinsModel.column_widths[index] || 30; // Use column_widths
			const color = pinsModel.subpins_colors[index] || '#888';
            return `<div class="subpin" style="width: ${width}px">${subPin ?? ""}</div>`
        });
        
        const subPinsHTML =
            `<div class="subpins-outline" style="justify-content: ${subPinsJustify}">
                ${subPinsSlots.join('')}
            </div>`;

        return `<div class="pin" style="background:${pin.color};"
            onclick="editPin('${side}', '${pin.label.replace(/'/g, "\\'")}')">
            ${(side === 'left') ? subPinsHTML + labelHTML : labelHTML + subPinsHTML}
        </div>`;
    }).join("");
}

function editPin(side, currentLabel) {
	const newLabel = prompt("Enter new label for " + currentLabel + ":");
	if (!newLabel) return;
	const list = (side === 'left') ? leftPins : rightPins;
	const pin = list.find(p => p.label === currentLabel);
	if (pin) pin.label = newLabel;
	renderPins(side + 'Pins', list, side);
}

//# Load pin data from JSON file
async function loadPinData() {
	try {
		const pinData = await fetch('pins.json').then(response => response.json());
		renderPins(pinData.leftPins, 'left');
		renderPins(pinData.rightPins, 'right');
	} catch (error) {
		console.error('Error loading pin data:', error);
	}
}

//# Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
	loadPinData();
});