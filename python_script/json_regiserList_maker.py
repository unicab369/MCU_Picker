import register_parser
import re

def main():
	# Input data
	input_data = """
R32_FLASH_ACTLR 0x40022000 Control register 0x00000000 
R32_FLASH_KEYR 0x40022004 FPEC key register X 
R32_FLASH_OBKEYR 0x40022008 OBKEY register X 
R32_FLASH_STATR 0x4002200C Status register 0x00008000 
R32_FLASH_CTLR 0x40022010 Configuration register 0x00008080 
R32_FLASH_ADDR 0x40022014 Address register X 
R32_FLASH_OBR 0x4002201C Option byte register 0x0XXXXXXX 
R32_FLASH_WPR 0x40022020 Write protection register 0xFFFFFFF 
R32_FLASH_MODEKEYR 0x40022024 Extended key register X 
R32_FLASH_BOOT_MODEKEYR 0x40022028 Unlock BOOT key register X
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()