Add this vsCode extension to provides HTML syntax highlighting in template literals
Add: `es6-string-html`
Usage: add `/*html*/` in front of template literals

bits_fields parsing prompt:
make json for the following fields: ["range", "name", "access", "info", "reset_value"]

reg_table parsing prompt:
make json for the following fields: ["name", "address", "info"", "reset_value"]

How to use json_registerList_maker.py
copy the Register List table from the datasheet
paste it under input_data = """
and run the script
Note: all of the content under a register has to be on the same line, remove the extra \n as needed
the generated json should go under the "registers" field
For copies from PDF that create multiple lines, simply Alt-Select all the line and do backspace once
to put everything in the same line. Next, Search and replace `RXX_` with `\nRXX_`
Sometime, the copy also include `Description` and `Reset value` from the table header, remove them too
Finally, run and generate again.
If the registers are on different page, copy and paste them separately