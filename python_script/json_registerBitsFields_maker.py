import register_parser

def main():
	# Input data
	input_data = """
[31:0] BOOTKEYR[31:0] WO Enter the following sequence to unlock the BOOT area KEY1 = 0x45670123. KEY2 = 0xCDEF89AB. X 
	"""



	# Parse the data
	headers = ['range', 'name', 'access', 'info', 'reset_value']
	relative_path = '/python_script/registerBitsFields.json'
	register_parser.parse_data(input_data, headers, [3], relative_path, True)
	
if __name__ == "__main__":
	main()