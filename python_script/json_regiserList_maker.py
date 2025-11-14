import register_parser

def main():
	# Input data
	input_data = """
	R32_RCC_CTLR 0x40021000 Clock control register 0x0000xx83
	R32_RCC_CFGR0 0x40021004 Clock configuration register 0 0x00000020
	R32_RCC_INTR 0x40021008 Clock interrupt register 0x00000000
	R32_RCC_APB2PRSTR 0x4002100C PB2 peripheral reset register 0x00000000
	R32_RCC_APB1PRSTR 0x40021010 PB1 peripheral reset register 0x00000000
	R32_RCC_AHBPCENR 0x40021014 HB peripheral clock enable register 0x00000004
	R32_RCC_APB2PCENR 0x40021018 PB2 peripheral clock enable register 0x00000000
	R32_RCC_APB1PCENR 0x4002101C PB1 peripheral clock enable register 0x00000000
	R32_RCC_RSTSCKR 0x40021024 Control/status register 0x0C000000
	"""
	
	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value']
	relative_path = '/python_script/registerList.json'
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()