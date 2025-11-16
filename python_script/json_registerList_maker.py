import register_parser
import re

def main():
	# Input data
	input_data = """
R8_UDEV_CTRL 0x40008001 USB device physical port control register 0xX0 
R8_UEP4_1_MOD 0x4000800c Endpoint 1/4 mode control register 0x00 
R8_UEP2_3_MOD 0x4000800d Endpoint 2/3 mode control register 0x00 
R8_UEP567_MOD 0x4000800e Endpoint 5/6/7 mode control register 0x00 
R16_UEP0_DMA 0x40008010 Start address of endpoint0 buffer 0xXXXX 
R16_UEP1_DMA 0x40008014 Start address of endpoint1 buffer 0xXXXX 
R16_UEP2_DMA 0x40008018 Start address of endpoint2 buffer 0xXXXX 
R16_UEP3_DMA 0x4000801c Start address of endpoint3 buffer 0xXXXX 
R8_UEP0_T_LEN 0x40008020 Endpoint0 transmission length register 0xXX 
R8_UEP0_CTRL 0x40008022 Endpoint0 control register 0x00 
R8_UEP1_T_LEN 0x40008024 Endpoint1 transmission length register 0xXX 
R8_UEP1_CTRL 0x40008026 Endpoint1 control register 0x00 
R8_UEP2_T_LEN 0x40008028 Endpoint2 transmission length register 0xXX 
R8_UEP2_CTRL 0x4000802a Endpoint2 control register 0x00 
R8_UEP3_T_LEN 0x4000802c Endpoint3 transmission length register 0xXX 
R8_UEP3_CTRL 0x4000802e Endpoint3 control register 0x00 
R8_UEP4_T_LEN 0x40008030 Endpoint4 transmission length register 0xXX 
R8_UEP4_CTRL 0x40008032 Endpoint4 control register 0x00 
R16_UEP5_DMA 0x40008054 Start address of endpoint5 buffer 0xXXXX 
R16_UEP6_DMA 0x40008058 Start address of endpoint6 buffer 0xXXXX 
R16_UEP7_DMA 0x4000805c Start address of endpoint7 buffer 0xXXXX 
R8_UEP5_T_LEN 0x40008064 Endpoint5 transmission length register 0xXX 
R8_UEP5_CTRL 0x40008066 Endpoint5 control register 0x00 
R8_UEP6_T_LEN 0x40008068 Endpoint6 transmission length register 0xXX 
R8_UEP6_CTRL 0x4000806a Endpoint6 control register 0x00 
R8_UEP7_T_LEN 0x4000806c Endpoint7 transmission length register 0xXX 
R8_UEP7_CTRL 0x4000806e Endpoint7 control register 0x00 
R32_EPX_MODE 0x40008070 Endpoint8-15 control register 0x00000000
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()