
# csstagged

## Synopsis

CSSTagged visualizes a number of important signs of the overall health of the CSS of HTML based development projects. Information such as how rules are nested, how much inheritance and reuse is occurring, name duplications, and providing a way for rules to be expressed in isolation are all valuable to creating projects that are scalable and manageable long term. The latest version also includes an auto generated style guide based on the tags and relationships and variables declared in preprocessing (LESS only).


## Installation


1. add csstagged to your package.json and install
2. after installing, view
	/node_modules/csstagged/
	on your server to preview how it should look
3. Move the file /node_modules/csstagged/install/csstagged.html (and styleguide.html) to the folder where your CSS is loaded from. CSSTagged will be loading assets so it needs to have the same relative paths (or change root path in Less).
4. Change the path within this file to the location of CSSTagged
5. Create a folder "csstagged" on your root and redirect to the csstagged.html file in your destination folder (duplicate for styleguide.html). An example is in /node_modules/csstagged/install/csstagged (OPTIONAL)
6. (check for node_modules path excludes in .htaccess)
7. CSSTagged needs all of your Less files combined in order and then LESS compiled.
	Add updates to your Gruntfile.js to include concat, less, and css_parse. Examples are in
	/node_modules/csstagged/install/
8. Install the CSSTagged plugin into the Less configuration in the GruntFile.
9. css_parse your final single css file into the same folder as csstagged.html.

## Tags

### CSS Tag Style
(a tag with a comment and a -ctag will ignore the comment)

```CSS
-ctag-tag: "button";

// a global rule will be injected into preview every time.
-ctag-global: "true";

// "..." auto injects <div class="[classname]">[content]</div>
// { .class_name } replaces with the template referred to by the class_name
// this could be the just the name of the tag or the full selector
-ctag-example: "...Label";
// Replaces to <div class="[classname]">Label</div>

// can also nest entirely within a comment for line returns
/* -ctag-example: ...{ .row }
					{ .row }
					{ .row }
					{ .row }
*/

-ctag-example: "<span ...>Label</div>";
// Replaces to <span class="[classname]">Label</span>

-ctag-example: "...{ .myLabel }";
// Replaces to <div class="[classname]"><div class="myLabel">Label</div></div>

-ctag-example: "<span class="a">Label</div>";
// no replacement

// any selector starting with these will be ignored
-ctag-ignore: ".nano";

// a way to force url image/font roots
-ctag-url_prefix: "/client/_client/";
```

### HTML Comment Style (Deprecated)

## Example

```CSS
.siteButton {
	-ctag-tag: "button";
	-ctag-example: "...Label";

	color: #000;
}

.mySection {
	-ctag-tag: "section";
	-ctag-example: "...{ .myButton }";

	width: 50%; height: 100%;

	.myButton {
		-ctag-tag: "button";
		-ctag-example: "...label";

		&:extends(
			.siteButton
		);
		color: #f00;
	}
}
```

## Example

```CSS
.siteButton {
	-ctag-tag: button;
	-ctag-example: ...Label;

	color: #000;
}

.mySection {
	-ctag-tag: section;
	-ctag-example: ...{ .myButton };
	-ctag-description: "Contains myButton";

	width: 50%; height: 100%;

	.myButton {
		-ctag-tag: button;
		-ctag-example: ...Label;
		&:extends(
			.siteButton
		);

		color: #f00;
	}
}
```
