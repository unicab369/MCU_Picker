import register_parser
import re

def main():
	# Input data
	input_data = """
R16_SPI3_CTLR1 0x40003C00 SPI3 control register1 0x0000 
R16_SPI3_CTLR2 0x40003C04 SPI3 control register2 0x0000 
R16_SPI3_STATR 0x40003C08 SPI3 status register 0x0002 
R16_SPI3_DATAR 0x40003C0C SPI3 data register 0x0000 
R16_SPI3_CRCR 0x40003C10 SPI3 polynomial register 0x0007 
R16_SPI3_RCRCR 0x40003C14 SPI3 receive CRC register 0x0000 
R16_SPI3_TCRCR 0x40003C18 SPI3 transmit CRC register 0x0000 
R16_SPI3_I2S_CFGR 0x40003C1C SPI3 I2S configuration register 0x00 
R16_SPI3_I2SPR 0x40003C20 SPI3 I2S prescaler register 0x00 
R16_SPI3_HSCR 0x40003C24 SPI3 high-speed control register 0x00 
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()