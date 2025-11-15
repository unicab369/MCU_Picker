import register_parser

def main():
	# Input data
	input_data = """
15:0] DMAB[15:0] RW The DMA address in continuous mode. 0
	"""



	# Parse the data
	headers = ['range', 'name', 'access', 'info', 'reset_value']
	relative_path = '/python_script/registerBitsFields.json'
	register_parser.parse_data(input_data, headers, [3], relative_path, True)
	
if __name__ == "__main__":
	main()