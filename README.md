
# csstagged

## Synopsis

CSSTagged visualizes a number of important signs of the overall health of the CSS of HTML based development projects. Information such as how rules are nested, how much inheritance and reuse is occurring, name duplications, and providing a way for rules to be expressed in isolation are all valuable to creating projects that are scalable and manageable long term.


## Installation


1. add csstagged to your package.json and install
2. after installing, view
	/node_modules/csstagged/
	on your server to preview how it should look
3. Move the file /node_modules/csstagged/install/csstagged.html to the folder where your CSS is loaded from. CSSTagged will be loading assets so it needs to have the same relative paths.
4. Change the path within this file to the location of CSSTagged
5. Create a folder "csstagged" on your root and redirect to the csstagged.html file in your destination folder. An example is in /node_modules/csstagged/install/csstagged (OPTIONAL)
6. (check for node_modules path excludes in .htaccess)
7. CSSTagged needs all of your Less files combined in order and then LESS compiled.
	Add updates to your Gruntfile.js to include concat, less, and css_parse. Examples are in
	/node_modules/csstagged/install/  
8. css_parse your final single css file into the same folder as csstagged.html.

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

### HTML Comment Style

```CSS
/*<csstag
	tags="a,b,c"
	global="true"
	ignore=".3rdparty,.other">
	...
</csstag>*/
```

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

## Example (Comment)

```CSS
.siteButton {
	/*<csstag
		tags="button">
		...Label
	</csstag>*/

	color: #000;
}

.mySection {
	/*<csstag
		tags="section">
		...{ .myButton }
	</csstag>*/

	width: 50%; height: 100%;

	.myButton {
		/*<csstag
			tags="button">
			...Label
		</csstag>*/

		&:extends(
			.siteButton
		);
		color: #f00;
	}
}
```
