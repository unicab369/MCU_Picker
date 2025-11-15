import register_parser
import re

def main():
	# Input data
	input_data = """
R16_TIM1_CTLR1 0x40012C00 Control register 1 0x0000 
R16_TIM1_CTLR2 0x40012C04 Control register 2 0x0000 
R16_TIM1_SMCFGR 0x40012C08 Slave mode control register 0x0000 
R16_TIM1_DMAINTENR 0x40012C0C DMA/interrupt enable register 0x0000 
R16_TIM1_INTFR 0x40012C10 Interrupt status register 0x0000 
R16_TIM1_SWEVGR 0x40012C14 Event generation register 0x0000 
R16_TIM1_CHCTLR1 0x40012C18 Compare/capture control register 1 0x0000 
R16_TIM1_CHCTLR2 0x40012C1C Compare/capture control register 2 0x0000 
R16_TIM1_CCER 0x40012C20 Compare/capture enable register 0x0000 
R16_TIM1_CNT 0x40012C24 Counters 0x0000 
R16_TIM1_PSC 0x40012C28 Counting clock prescaler 0x0000 
R16_TIM1_ATRLR 0x40012C2C Auto-reload value register 0xFFFF 
R16_TIM1_RPTCR 0x40012C30 Recurring count value register 0x0000 
R32_TIM1_CH1CVR 0x40012C34 Compare/capture register 1 0x00000000 
R32_TIM1_CH2CVR 0x40012C38 Compare/capture register 2 0x00000000 
R32_TIM1_CH3CVR 0x40012C3C Compare/capture register 3 0x00000000 
R32_TIM1_CH4CVR 0x40012C40 Compare/capture register 4 0x00000000 
R16_TIM1_BDTR 0x40012C44 Brake and dead-time registers 0x0000 
R16_TIM1_DMACFGR 0x40012C48 DMA control register 0x0000 
R16_TIM1_DMAADR 0x40012C4C DMA address register for continuous mode 0x0000 
	"""


	# Parse the data
	headers = ['name', 'address', 'info', 'reset_value', 'bits_fields']
	relative_path = '/python_script/registerList.json'

	# add [] to the end for bits_fields
	input_data = re.sub(r'$', ' []', input_data, flags=re.MULTILINE)
	register_parser.parse_data(input_data, headers, [2], relative_path)
	
if __name__ == "__main__":
	main()