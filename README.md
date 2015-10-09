# csstagged

## Synopsis

CSSTagged visualizes a number of important signs of the overall health of
the CSS of HTML based development projects. Information such as how rules are
nested, how much inheritance and reuse is occurring, name duplications, and
providing a way for rules to be expressed in isolation are all valuable to
creating projects that are scalable and manageable long term.

## Motivation

...

## Installation


1. add csstagged to your package.json and install
2. after installing, view "/node_modules/csstagged/client/" on your server
to preview how it should look
3. create "csstagged" on your root and move move
    /node_modules/csstagged/install/csstagged/index.html to this folder
4. (check for node_modules path excludes in .htaccess)
5. add updates to your Gruntfile.js to include concat, less, and css_parse (
    example is in install folder as well ). Examples are in
    /node_modules/csstagged/install/
    This requires Less to be concated into a single file before Less processed.
    The css_parse will create the file that csstagged uses. Make sure it is
    built into the "csstaged" folder.

## Tags

<pre>
-ctag-tag: "button";
-ctag-global: "true";
-ctag-example: "&lt;div ...>Label&lt;/div>";
-ctag-ignore: ".nano";
-ctag-url_prefix: "/client/_client/";
</pre>

## Example

<pre>

.siteButton {
    -ctag-tag: "button";
    -ctag-example: "&lt;div ...>Label&lt;/div>"; // auto injects class name

    color: #000;
}

.mySection {
    -ctag-tag: "section";
    // child templates referenced by name (or full selector)
    -ctag-example: "&lt;div ...>{ .myButton }&lt;/div>";

    width: 50%; height: 100%;

    .myButton {
        -ctag-tag: "button";
        -ctag-example: "&lt;div ...>label&lt;/div>";

        &:extends( // understands extension (at least in LESS)
            .siteButton
        );    
        color: #f00;
    }
}

</pre>
