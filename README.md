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

1. view "/node_modules/csstagged/client/" to preview how it should look
2. add csstagged to your package.json and install
3. move /node_modules/csstagged/install/csstagged to your server root
4. do an npm install on the csstagged folder
5. (check for node_modules path excludes in .htaccess)
6. add updates to your Gruntfile.js to include concat, less, and css_parse (
    example is in install folder as well ). Examples are in
    /node_modules/csstagged/install/


<pre>

.siteButton {
    /*&lt;csstag tag="button"> // xml formatted comment
        &lt;div ...>&lt;/div> // auto injects class name
    &lt;/csstag>*/
    color: #000;
}

.mySection {
    /*&lt;csstag tag="section">
        &lt;div ...>
            { .myButton } // child templates referenced by name (or full selector)
        &lt;/div>
    &lt;/csstag>*/
    width: 50%; height: 100%;

    .myButton {
        /*&lt;csstag tag="button">
            &lt;div ...>&lt;/div>
        &lt;/csstag>*/
        &:extends( // understands extension (at least in LESS)
            .siteButton
        );    
        color: #f00;
    }
}

</pre>
