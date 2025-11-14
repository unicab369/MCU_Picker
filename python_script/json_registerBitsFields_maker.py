import register_parser

def main():
	# Input data
	input_data = """
[31:29] Reserved RO Reserved 0 
28 PWREN RW Power interface module clock enable bit. 
1: Module clock is on; 0: Module clock is off. 0 
[27:22] Reserved RO Reserved 0 
21 I2C1EN RW I2C 1 interface clock enable bit. 0 
[20:12] Reserved RO Reserved 0
1: Module clock is on; 0: Module clock is off. 
11 WWDGEN RW Window watchdog clock enable bit. 
1: Module clock is on; 0: Module clock is off. 
[10:1] Reserved RO Reserved 0
0 TIM2EN RW Timer 2 module clock enable bit. 
1: Module clock is on; 0: Module clock is off. 0
	"""
	
	# Parse the data
	headers = ['range', 'name', 'access', 'info', 'reset_value']
	relative_path = '/python_script/registerBitsFields.json'
	register_parser.parse_data(input_data, headers, [3], relative_path, True)
	
if __name__ == "__main__":
	main()