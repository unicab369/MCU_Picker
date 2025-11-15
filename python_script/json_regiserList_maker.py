import register_parser
import re

def main():
	# Input data
	input_data = """
R32_DMA_INTFR 0x40020000 DMA interrupt status register 
R32_DMA_INTFCR 0x00000000 0x40020004 DMA interrupt flag clear register
R32_DMA_CFGR1 0x00000000 0x40020008 DMA channel 1 configuration register
R32_DMA_CNTR1 0x00000000 0x4002000C DMA channel 1 number of data register 0x00000000
R32_DMA_PADDR1 0x40020010 DMA channel 1 peripheral address register 0x00000000 
R32_DMA_MADDR1 0x40020014 DMA channel 1 memory address register 0x00000000 
R32_DMA_CFGR2 0x4002001C DMA channel 2 configuration register 0x00000000 
R32_DMA_CNTR2 0x40020020 DMA channel 2 number of data register 0x00000000 
R32_DMA_PADDR2 0x40020024 DMA channel 2 peripheral address register 0x00000000 
R32_DMA_MADDR2 0x40020028 DMA channel 2 memory address register 0x00000000 
R32_DMA_CFGR3 0x40020030 DMA channel 3 configuration register 0x00000000 
R32_DMA_CNTR3 0x40020034 DMA channel 3 number of data register 0x00000000 
R32_DMA_PADDR3 0x40020038 DMA channel 3 peripheral address register 0x00000000 
R32_DMA_MADDR3 0x4002003C DMA channel 3 memory address register 0x00000000 
R32_DMA_CFGR4 0x40020044 DMA channel 4 configuration register 0x00000000 
R32_DMA_CNTR4 0x40020048 DMA channel 4 number of data register 0x00000000 
R32_DMA_PADDR4 0x4002004C DMA channel 4 peripheral address register 0x00000000 
R32_DMA_MADDR4 0x40020050 DMA channel 4 memory address register 0x00000000 
R32_DMA_CFGR5 0x40020058 DMA channel 5 configuration register 0x00000000 
R32_DMA_CNTR5 0x4002005C DMA channel 5 number of data register 0x00000000 
R32_DMA_PADDR5 0x40020060 DMA channel 5 peripheral address register 0x00000000 
R32_DMA_MADDR5 0x40020064 DMA channel 5 memory address register 0x00000000 
R32_DMA_CFGR6 0x4002006C DMA channel 6 configuration register 0x00000000 
R32_DMA_CNTR6 0x40020070 DMA channel 6 number of data register 0x00000000 
R32_DMA_PADDR6 0x40020074 DMA channel 6 peripheral address register 0x00000000 
R32_DMA_MADDR6 0x40020078 DMA channel 6 memory address register 0x00000000 
R32_DMA_CFGR7 0x40020080 DMA channel 7 configuration register 0x00000000 
R32_DMA_CNTR7 0x40020084 DMA channel 7 number of data register 0x00000000 
R32_DMA_PADDR7 0x40020088 DMA channel 7 peripheral address register 0x00000000 
R32_DMA_MADDR7 0x4002008C DMA channel 7 memory address register 0x00000000 
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()