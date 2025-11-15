import os
import re
import json

def process_string(input_text):
	def replace_optionNewLine(match):
		cleaned = match.group().lstrip()
		return f" {cleaned}"  # replacement
	
	# `(\s*)(\d*: )` - replace matching pattern: prefix string | integer | ': '. eg: "  0: ", "  1: ", "  0100: "
	pattern = r'\s*\d*: '
	input_text = re.sub(pattern, replace_optionNewLine, input_text, flags=re.MULTILINE)
	print("=" * 10)
	print("first filter: \n", input_text)

	def replace_optionValues(match):
		full_match = match.group()

		if "RO Reserved" in full_match:
			return " RO Reserved"  # replacement
		else:
			cleaned = full_match.lstrip()
			return f" {cleaned}"  # replacement
	
	
	# `(\s+RO Reserved)` - replace matching pattern: prefix string | "RO Reserved"
	pattern = r'\s+RO Reserved'
	input_text = re.sub(pattern, replace_optionValues, input_text, flags=re.MULTILINE)

	def move_zero(match):
		return match.group(1) + " 0\n"
	
	# move "0" after "off."
	# check for ".\n   0" on a line
	pattern = r'(.*\.)\s*\n\s*0\s*'
	input_text = re.sub(pattern, move_zero, input_text, flags=re.MULTILINE)

	def process_register_name(match):
		# The word is always in group 1 with this simpler pattern
		word = match.group(1)
		return " " + word

	# move register name to the end of previous line
	# check for "    REG_NAME    " on a line
	pattern = r'\s*\n\s*([A-Z]+)\s*$'
	input_text = re.sub(pattern, process_register_name, input_text, flags=re.MULTILINE)

	# move "RW" to the end of previous line
	# check for "    RW    " on a line
	pattern = r'\n(RW\s+.*)'
	input_text = re.sub(pattern, replace_optionValues, input_text, flags=re.MULTILINE)

	return input_text


# arrayOrObject: True for array, False for object
def parse_data(input_text, headers, long_str_columns=None, relative_path='', arrayOrObject=False):
	"""
	Advanced parser that can handle multiple columns with spaces
	"""
	# Process the input string
	input_text = process_string(input_text)

	## Print out the parsing string
	print(input_text)

	registers = [] if arrayOrObject else {}

	for line in input_text.strip().split('\n'):
		line = line.strip()
		if not line: 
			continue
			
		expected_columns = len(headers)
		
		# Build regex pattern
		pattern_parts = []
		for i in range(expected_columns):
			if long_str_columns and i in long_str_columns:
				pattern_parts.append(r'(.+?)')  # Columns that can have spaces
			else:
				pattern_parts.append(r'(\S+)')  # Single word columns
		
		# \S - Matches any non-whitespace character (letters, numbers, symbols)
		# + - Matches one or more of the preceding character

		# '^\s*' - Start of line, optional whitespace
		# '\s+' - One or more whitespace
		# '(.+?)' - Capture group: Columns that can have spaces
		# '(\S+)' - Capture group: Single word column
		# '\s*$' - End of line, Optional whitespace

		pattern = r'^\s*' + r'\s+'.join(pattern_parts) + r'\s*$'
		match = re.match(pattern, line)
		
		if match:
			register_data = {}
			for i, header in enumerate(headers):
				if i < len(match.groups()):
					register_data[header] = match.group(i + 1).strip()
					
			if arrayOrObject:
				registers.append(register_data)
			else:
				registers[match.group(1).strip()] = register_data
		else:
			print(f"Could not parse line: {line}")
    
	# Convert to JSON string with pretty formatting
	json_string = json.dumps(registers, indent=2)

	# Print the JSON string
	print(f"JSON Output: {json_string}")
	
	# Get current working directory
	target_path = relative_path if relative_path else '/python_script/register_parser.json'
	file_path = os.getcwd() + target_path

	# Save to file
	with open(file_path, 'w') as f: f.write(json_string)
	print(f"File saved to: {file_path}")
	print(f"Parsed {len(registers)} registers")


# This code won't run when imported
if __name__ == "__main__":
	print("imported as a module")