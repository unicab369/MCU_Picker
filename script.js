let leftPins = [];
let rightPins = [];

//# Load pin data from JSON file
async function loadPinData() {
	try {
		const response = await fetch('pins.json');
		const pinData = await response.json();
		leftPins = pinData.leftPins;
		rightPins = pinData.rightPins;
		renderPins('leftPins', leftPins, 'left');
		renderPins('rightPins', rightPins, 'right');
	} catch (error) {
		console.error('Error loading pin data:', error);
	}
}

//# render pins dynamically with sub-pins on the right
function renderPins(containerId, pins, side) {
	const container = document.getElementById(containerId);
	container.innerHTML = pins.map(pin => 
		`<div class="pin" style="background:${pin.color};" onclick="editPin('${side}', '${pin.label.replace(/'/g, "\\'")}')">
			<div>${pin.label}</div>
			${pin.subPins && pin.subPins.length > 0 ? 
				`<div class="pin-subpins">${pin.subPins.map(subPin => 
					`<div class="pin-subpin">${subPin}</div>`
				).join('')}</div>` : 
				'<div class="pin-subpins"></div>'
			}
		</div>`
	).join("");
}

function editPin(side, currentLabel) {
	const newLabel = prompt("Enter new label for " + currentLabel + ":");
	if (!newLabel) return;
	const list = side === 'left' ? leftPins : rightPins;
	const pin = list.find(p => p.label === currentLabel);
	if (pin) pin.label = newLabel;
	renderPins(side + 'Pins', list, side);
}

//# Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
	loadPinData();
});