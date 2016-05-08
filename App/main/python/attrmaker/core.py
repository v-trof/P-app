attrs_f = open("attrs_in.txt", "r")
attrs = attrs_f.read().split("\nVM279:2 ")

attrs_f = open("attrs_out.txt", "w")

new_attrs = ""

for attr in attrs:
    new_attrs += "{% if " + attr + " %} \n"
    new_attrs += attr + "='{{" + attr + "}}' \n"
    new_attrs += "{% endif %}\n\n"

attrs_f.write(new_attrs)
