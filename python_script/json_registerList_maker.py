import register_parser
import re

def main():
	# Input data
	input_data = """

R32_STK_CTRL 0x00 System count control register 0x00000000
R32_STK_SR 0x04 System count status register 0x00000000
R32_STK_CNTL 0x08 System counter low register 0x00000000
R32_STK_CMPLR 0x10 Count reloaded low register 0x00000000
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()