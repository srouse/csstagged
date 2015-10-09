# csstagged

## Synopsis

CSSTagged visualizes a number of important signs of the overall health of the CSS of HTML based development projects. Information such as how rules are nested, how much inheritance and reuse is occurring, name duplications, and providing a way for rules to be expressed in isolation are all valuable to creating projects that are scalable and manageable long term.


## Installation


1. add csstagged to your package.json and install
2. after installing, view
	/node_modules/csstagged/client/
	on your server to preview how it should look
3. create "csstagged" on your root and move move
	/node_modules/csstagged/install/csstagged/index.html
	to this folder
4. (check for node_modules path excludes in .htaccess)
5. add updates to your Gruntfile.js to include concat, less, and css_parse ( example is in install folder as well ). Examples are in
	/node_modules/csstagged/install/
	This requires Less to be concated into a single file before Less processed. The css_parse will create the file that csstagged uses. Make sure it is built into the "csstaged" folder.

## Tags

### CSS Tag Style
(a tag with a comment and a -ctag will ignore the comment)

	-ctag-tag: "button";

	// a global rule will be injected into preview every time.
	-ctag-global: "true";

	// "..." auto injects class="[classname]"
	-ctag-example: "<div ...>Label</div>";

	// any selector starting with these will be ignored
	-ctag-ignore: ".nano";

	// a way to force url image/font roots
	-ctag-url_prefix: "/client/_client/";


### HTML Comment Style


	/*<csstag
		tags="a,b,c"
		global="true"
		ignore=".3rdparty,.other">
		<div ...></div>
	</csstag>*/


## Example

	.siteButton {
		-ctag-tag: "button";
		-ctag-example: "<div ...>Label</div>";

		color: #000;
	}

	.mySection {
		-ctag-tag: "section";
		-ctag-example: "<div ...>{ .myButton }</div>";

		width: 50%; height: 100%;

		.myButton {
			-ctag-tag: "button";
			-ctag-example: "<div ...>label</div>";

			&:extends(
				.siteButton
			);
			color: #f00;
		}
	}

## Example (Comment)

	.siteButton {
		/*<csstag
			tags="button">
			<div ...>Label</div>
		</csstag>*/

		color: #000;
	}

	.mySection {
		/*<csstag
			tags="section">
			<div ...>
				{ .myButton }
			</div>
		</csstag>*/

		width: 50%; height: 100%;

		.myButton {
			/*<csstag
				tags="button">
				<div ...>Label</div>
			</csstag>*/

			&:extends(
				.siteButton
			);
			color: #f00;
		}
	}
