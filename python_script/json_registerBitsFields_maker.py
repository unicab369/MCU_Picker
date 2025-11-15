import register_parser

def main():
	# Input data
	input_data = """
[31:15] Reserved RO Reserved 0 
14 MEM2MEM RW Memory-to-memory mode enable. 1: Enable memory-to-memory data transfer mode. 0: Disable memory-to-memory data transfer mode. 0 
[13:12] PL RW Channel priority setting. 00: low; 01: medium. 10: High; 11:Very high. 0 
[11:10] MSIZE RW Memory address data width setting. 00: 8 bits; 01: 16 bits. 10: 32 bits; 11: Reserved. 0 
[9:8] PSIZE RW Peripheral address data width setting. 00: 8 bits; 01: 16 bits. 0 
	"""
	
	# Parse the data
	headers = ['range', 'name', 'access', 'info', 'reset_value']
	relative_path = '/python_script/registerBitsFields.json'
	register_parser.parse_data(input_data, headers, [3], relative_path, True)
	
if __name__ == "__main__":
	main()