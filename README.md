# LWCSearchPoc
# Custom Types in LWC Lightning Datatable

Creating Custom Data Types
Create your own data types if you want to implement a custom cell, such as a delete row button or an image, or even a custom number display. Here's how you can create custom data types.

Extend the LightningDatatable class and define your custom types.
Create your templates to override the default.

Pass in the following properties.

template - The name of your template resource
standardCellLayout - Specifies whether the standard layout is used. The default layout for custom cells is the bare layout. See Using Different Layouts in Custom Cells.
typeAttributes - An object with your custom type data, which is defined in the child component. Access your data using the typeAttributes.attrA syntax.

