import register_parser

def main():
	# Input data
	input_data = """
[31:24] Reserved RO Reserved 00h 
[23:16] R8_PB_CLR_2 WZ PB data register reset control: 1: The corresponding bit data of R32_PB_OUT is cleared to 0; 0: No effect. 00h 
[15:8] R8_PB_CLR_1 WZ 00h 
[7:0] R8_PB_CLR_0 WZ 00h 
	"""



	# Parse the data
	headers = ['range', 'name', 'access', 'info', 'reset_value']
	relative_path = '/python_script/registerBitsFields.json'
	register_parser.parse_data(input_data, headers, [3], relative_path, True)
	
if __name__ == "__main__":
	main()