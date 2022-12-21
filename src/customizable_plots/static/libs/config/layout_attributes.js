/*
* https://github.com/plotly/plotly.js/blob/master/src/plots/layout_attributes.js
* */

function descriptionOnlyNumbers(label, x) {
    return [
        'Sets the ' + label + ' formatting rule' + (x ? 'for `' + x + '` ' : ''),
        'using d3 formatting mini-languages',
    ].join(' ');
}

function descriptionWithDates(label, x) {
    return descriptionOnlyNumbers(label, x) + [
        'We add two items to d3\'s date formatter:',
        '*%h* for half of the year as a decimal number as well as',
        '*%{n}f* for fractional seconds',
        'with n digits. For example, *2016-10-13 09:15:23.456* with tickformat',
        '*%H~%M~%S.%2f* would display *09~15~23.46*'
    ].join(' ');
}

// IMPORTANT - default colors should be in hex for compatibility
const colorAttrs = {
    // defaults : [ // default colors from plotly
    //     '#1f77b4',  // muted blue
    //     '#ff7f0e',  // safety orange
    //     '#2ca02c',  // cooked asparagus green
    //     '#d62728',  // brick red
    //     '#9467bd',  // muted purple
    //     '#8c564b',  // chestnut brown
    //     '#e377c2',  // raspberry yogurt pink
    //     '#7f7f7f',  // middle gray
    //     '#bcbd22',  // curry yellow-green
    //     '#17becf'   // blue-teal
    // ],
    defaults : [ // replaced with colors from https://mui.com/material-ui/customization/color/
        '#9c27b0',
        '#2196f3',
        '#009688',
        '#cddc39',
        '#4caf50',
        '#ff9800',
        '#3f51b5',
        '#795548',
        '#9e9e9e',
        '#ff5722',
        '#607d8b',
        '#e91e63',
        '#673ab7',
        '#f44336',

    ],
    defaultLine : '#444',

    lightLine : '#eee',

    background : '#fff',

    borderLine : '#BEC8D9',

// with axis.color and Color.interp we aren't using lightLine
// itself anymore, instead interpolating between axis.color
// and the background color using tinycolor.mix. lightFraction
// gives back exactly lightLine if the other colors are defaults.
    lightFraction : 100 * (0xe - 0x4) / (0xf - 0x4),
}

// var globalFont = fontAttrs({
//     editType: 'calc',
//     description: [
//         'Sets the global font.',
//         'Note that fonts used in traces and other',
//         'layout components inherit from the global font.'
//     ].join(' ')
// });
// globalFont.family.dflt = '"Open Sans", verdana, arial, sans-serif';
// globalFont.size.dflt = 12;
// globalFont.color.dflt = colorAttrs.defaultLine;

const axis_attributes = {
    title: {
        text: {
            valType: 'string',
            description: [
                'Sets the title of this axis.',
                'Note that before the existence of `title.text`, the title\'s',
                'contents used to be defined as the `title` attribute itself.',
                'This behavior has been deprecated.'
            ].join(' ')
        },
        font: {
            valType: 'string',
            editType: 'ticks',
            description: [
                'Sets this axis\' title font.',
                'Note that the title\'s font used to be customized',
                'by the now deprecated `titlefont` attribute.'
            ].join(' ')
        },
        standoff: {
            valType: 'number',
            min: 0,
            description: [
                'Sets the standoff distance (in px) between the axis labels and the title text',
                'The default value is a function of the axis tick labels, the title `font.size`',
                'and the axis `linewidth`.',
                'Note that the axis title position is always constrained within the margins,',
                'so the actual standoff distance is always less than the set or default value.',
                'By setting `standoff` and turning on `automargin`, plotly.js will push the',
                'margins to fit the axis title at given standoff distance.'
            ].join(' ')
        },
    },

    visible: {
        valType: 'boolean',
        dflt: true,
        description: [
            'A single toggle to hide the axis while preserving interaction like dragging.',
            'Default is true when a cheater plot is present on the axis, otherwise',
            'false'
        ].join(' ')
    },
    fixedrange: {
        valType: 'boolean',
        dflt: false,
        description: [
            'Determines whether or not this axis is zoom-able.',
            'If true, then zoom is disabled.'
        ].join(' ')
    },
    showticklabels: {
        valType: 'boolean',
        dflt: true,
        description: 'Determines whether or not the tick labels are drawn.'
    },
    showspikes: {
        valType: 'boolean',
        dflt: false,
        description: [
            'Determines whether or not spikes (aka droplines) are drawn for this axis.',
            'Note: This only takes affect when hovermode = closest'
        ].join(' ')
    },
    separatethousands: {
        valType: 'boolean',
        dflt: false,
        editType: 'ticks',
        description: [
            'If "true", even 4-digit integers are separated'
        ].join(' ')
    },
    showline: {
        valType: 'boolean',
        dflt: false,
        editType: 'ticks+layoutstyle',
        description: [
            'Determines whether or not a line bounding this axis is drawn.'
        ].join(' ')
    },
    showgrid:  {
        valType: 'boolean',
        dflt: true,
        editType: 'ticks',
        description: [
            'Determines whether or not grid lines are drawn.',
            'If *true*, the grid lines are drawn at every tick mark.'
        ].join(' ')
    },
    zeroline: {
        valType: 'boolean',
        editType: 'ticks',
        description: [
            'Determines whether or not a line is drawn at along the 0 value',
            'of this axis.',
            'If *true*, the zero line is drawn on top of the grid lines.'
        ].join(' ')
    },
    showdividers: {
        valType: 'boolean',
        dflt: true,
        editType: 'ticks',
        description: [
            'Determines whether or not a dividers are drawn',
            'between the category levels of this axis.',
            'Only has an effect on *multicategory* axes.'
        ].join(' ')
    },
    uirevision: {
        valType: 'boolean',
        dflt: true,
        description: [
            'Controls persistence of user-driven changes in axis `range`,',
            '`autorange`, and `title` if in `editable: true` configuration.',
            'Defaults to `layout.uirevision`.'
        ].join(' ')
    },

    type: {
        valType: 'enumerated',
        // '-' means we haven't yet run autotype or couldn't find any data
        // it gets turned into linear in gd._fullLayout but not copied back
        // to gd.data like the others are.
        values: ['-', 'linear', 'log', 'date', 'category', 'multicategory'],
        dflt: '-',
        // we forget when an axis has been autotyped, just writing the auto
        // value back to the input - so it doesn't make sense to template this.
        // Note: we do NOT prohibit this in `coerce`, so if someone enters a
        // type in the template explicitly it will be honored as the default.
        _noTemplating: true,
        description: [
            'Sets the axis type.',
            'By default, plotly attempts to determined the axis type',
            'by looking into the data of the traces that referenced',
            'the axis in question.'
        ].join(' ')
    },
    autotypenumbers: {
        valType: 'enumerated',
        values: ['convert types', 'strict'],
        dflt: 'convert types',
        description: [
            'Using *strict* a numeric string in trace data is not converted to a number.',
            'Using *convert types* a numeric string in trace data may be',
            'treated as a number during automatic axis `type` detection.',
            'Defaults to layout.autotypenumbers.'
        ].join(' ')
    },
    autorange: {
        valType: 'enumerated',
        values: [true, false, 'reversed'],
        dflt: true,
        impliedEdits: {'range[0]': undefined, 'range[1]': undefined},
        description: [
            'Determines whether or not the range of this axis is',
            'computed in relation to the input data.',
            'See `rangemode` for more info.',
            'If `range` is provided, then `autorange` is set to *false*.'
        ].join(' ')
    },
    rangemode: {
        valType: 'enumerated',
        values: ['normal', 'tozero', 'nonnegative'],
        dflt: 'normal',
        description: [
            'If *normal*, the range is computed in relation to the extrema',
            'of the input data.',
            'If *tozero*`, the range extends to 0,',
            'regardless of the input data',
            'If *nonnegative*, the range is non-negative,',
            'regardless of the input data.',
            'Applies only to linear axes.'
        ].join(' ')
    },
    constrain: {
        valType: 'enumerated',
        values: ['range', 'domain'],
        description: [
            'If this axis needs to be compressed (either due to its own `scaleanchor` and',
            '`scaleratio` or those of the other axis), determines how that happens:',
            'by increasing the *range*, or by decreasing the *domain*.',
            'Default is *domain* for axes containing image traces, *range* otherwise.'
        ].join(' ')
    },
    constraintoward: {
        valType: 'enumerated',
        values: ['left', 'center', 'right', 'top', 'middle', 'bottom'],
        description: [
            'If this axis needs to be compressed (either due to its own `scaleanchor` and',
            '`scaleratio` or those of the other axis), determines which direction we push',
            'the originally specified plot area. Options are *left*, *center* (default),',
            'and *right* for x axes, and *top*, *middle* (default), and *bottom* for y axes.'
        ].join(' ')
    },
    tickmode: {
        valType: 'enumerated',
        values: ['auto', 'linear', 'array'],
        impliedEdits: {tick0: undefined, dtick: undefined},
        description: [
            'Sets the tick mode for this axis.',
            'If *auto*, the number of ticks is set via `nticks`.',
            'If *linear*, the placement of the ticks is determined by',
            'a starting position `tick0` and a tick step `dtick`',
            '(*linear* is the default value if `tick0` and `dtick` are provided).',
            'If *array*, the placement of the ticks is set via `tickvals`',
            'and the tick text is `ticktext`.',
            '(*array* is the default value if `tickvals` is provided).'
        ].join(' ')
    },
    ticks: {
        valType: 'enumerated',
        values: ['outside', 'inside', ''],
        editType: 'ticks',
        description: [
            'Determines whether ticks are drawn or not.',
            'If **, this axis\' ticks are not drawn.',
            'If *outside* (*inside*), this axis\' are drawn outside (inside)',
            'the axis lines.'
        ].join(' ')
    },
    tickson: {
        valType: 'enumerated',
        values: ['labels', 'boundaries'],
        dflt: 'labels',
        description: [
            'Determines where ticks and grid lines are drawn with respect to their',
            'corresponding tick labels.',
            'Only has an effect for axes of `type` *category* or *multicategory*.',
            'When set to *boundaries*, ticks and grid lines are drawn half a category',
            'to the left/bottom of labels.'
        ].join(' ')
    },
    ticklabelmode: {
        valType: 'enumerated',
        values: ['instant', 'period'],
        dflt: 'instant',
        editType: 'ticks',
        description: [
            'Determines where tick labels are drawn with respect to their',
            'corresponding ticks and grid lines.',
            'Only has an effect for axes of `type` *date*',
            'When set to *period*, tick labels are drawn in the middle of the period',
            'between ticks.'
        ].join(' ')
    },
    // ticklabelposition: not used directly, as values depend on direction (similar to side)
    // left/right options are for x axes, and top/bottom options are for y axes
    ticklabelposition: {
        valType: 'enumerated',
        values: [
            'outside', 'inside',
            'outside top', 'inside top',
            'outside left', 'inside left',
            'outside right', 'inside right',
            'outside bottom', 'inside bottom'
        ],
        dflt: 'outside',
        editType: 'calc',
        description: [
            'Determines where tick labels are drawn with respect to the axis',
            'Please note that',
            'top or bottom has no effect on x axes or when `ticklabelmode` is set to *period*.',
            'Similarly',
            'left or right has no effect on y axes or when `ticklabelmode` is set to *period*.',
            'Has no effect on *multicategory* axes or when `tickson` is set to *boundaries*.',
            'When used on axes linked by `matches` or `scaleanchor`,',
            'no extra padding for inside labels would be added by autorange,',
            'so that the scales could match.'
        ].join(' ')
    },
    ticklabeloverflow: {
        valType: 'enumerated',
        values: [
            'allow',
            'hide past div',
            'hide past domain'
        ],
        description: [
            'Determines how we handle tick labels that would overflow either the graph div or the domain of the axis.',
            'The default value for inside tick labels is *hide past domain*.',
            'Otherwise on *category* and *multicategory* axes the default is *allow*.',
            'In other cases the default is *hide past div*.'
        ].join(' ')
    },
    mirror: {
        valType: 'enumerated',
        values: [true, 'ticks', false, 'all', 'allticks'],
        dflt: false,
        description: [
            'Determines if the axis lines or/and ticks are mirrored to',
            'the opposite side of the plotting area.',
            'If *true*, the axis lines are mirrored.',
            'If *ticks*, the axis lines and ticks are mirrored.',
            'If *false*, mirroring is disable.',
            'If *all*, axis lines are mirrored on all shared-axes subplots.',
            'If *allticks*, axis lines and ticks are mirrored',
            'on all shared-axes subplots.'
        ].join(' ')
    },
    spikesnap: {
        valType: 'enumerated',
        values: ['data', 'cursor', 'hovered data'],
        dflt: 'hovered data',
        editType: 'none',
        description: 'Determines whether spikelines are stuck to the cursor or to the closest datapoints.'
    },
    showtickprefix: {
        valType: 'enumerated',
        values: ['all', 'first', 'last', 'none'],
        dflt: 'all',
        editType: 'ticks',
        description: [
            'If *all*, all tick labels are displayed with a prefix.',
            'If *first*, only the first tick is displayed with a prefix.',
            'If *last*, only the last tick is displayed with a suffix.',
            'If *none*, tick prefixes are hidden.'
        ].join(' ')
    },
    showticksuffix: {
        valType: 'enumerated',
        values: ['all', 'first', 'last', 'none'],
        dflt: 'all',
        editType: 'ticks',
        description: 'Same as `showtickprefix` but for tick suffixes.'
    },
    showexponent: {
        valType: 'enumerated',
        values: ['all', 'first', 'last', 'none'],
        dflt: 'all',
        editType: 'ticks',
        description: [
            'If *all*, all exponents are shown besides their significands.',
            'If *first*, only the exponent of the first tick is shown.',
            'If *last*, only the exponent of the last tick is shown.',
            'If *none*, no exponents appear.'
        ].join(' ')
    },
    exponentformat: {
        valType: 'enumerated',
        values: ['none', 'e', 'E', 'power', 'SI', 'B'],
        dflt: 'B',
        editType: 'ticks',
        description: [
            'Determines a formatting rule for the tick exponents.',
            'For example, consider the number 1,000,000,000.',
            'If *none*, it appears as 1,000,000,000.',
            'If *e*, 1e+9.',
            'If *E*, 1E+9.',
            'If *power*, 1x10^9 (with 9 in a super script).',
            'If *SI*, 1G.',
            'If *B*, 1B.'
        ].join(' ')
    },
    side: {
        valType: 'enumerated',
        values: ['top', 'bottom', 'left', 'right'],
        editType: 'plot',
        description: [
            'Determines whether a x (y) axis is positioned',
            'at the *bottom* (*left*) or *top* (*right*)',
            'of the plotting area.'
        ].join(' ')
    },
    layer: {
        valType: 'enumerated',
        values: ['above traces', 'below traces'],
        dflt: 'above traces',
        editType: 'plot',
        description: [
            'Sets the layer on which this axis is displayed.',
            'If *above traces*, this axis is displayed above all the subplot\'s traces',
            'If *below traces*, this axis is displayed below all the subplot\'s traces,',
            'but above the grid lines.',
            'Useful when used together with scatter-like traces with `cliponaxis`',
            'set to *false* to show markers and/or text nodes above this axis.'
        ].join(' ')
    },
    categoryorder: {
        valType: 'enumerated',
        values: [
            'trace', 'category ascending', 'category descending', 'array',
            'total ascending', 'total descending',
            'min ascending', 'min descending',
            'max ascending', 'max descending',
            'sum ascending', 'sum descending',
            'mean ascending', 'mean descending',
            'median ascending', 'median descending'
        ],
        dflt: 'trace',
        editType: 'calc',
        description: [
            'Specifies the ordering logic for the case of categorical variables.',
            'By default, plotly uses *trace*, which specifies the order that is present in the data supplied.',
            'Set `categoryorder` to *category ascending* or *category descending* if order should be determined by',
            'the alphanumerical order of the category names.',
            'Set `categoryorder` to *array* to derive the ordering from the attribute `categoryarray`. If a category',
            'is not found in the `categoryarray` array, the sorting behavior for that attribute will be identical to',
            'the *trace* mode. The unspecified categories will follow the categories in `categoryarray`.',
            'Set `categoryorder` to *total ascending* or *total descending* if order should be determined by the',
            'numerical order of the values.',
            'Similarly, the order can be determined by the min, max, sum, mean or median of all the values.'
        ].join(' ')
    },

    minexponent: {
        valType: 'number',
        dflt: 3,
        min: 0,
        editType: 'ticks',
        description: [
            'Hide SI prefix for 10^n if |n| is below this number.',
            'This only has an effect when `tickformat` is *SI* or *B*.'
        ].join(' ')
    },
    ticklen: {
        valType: 'number',
        min: 0,
        description: 'Sets the tick length (in px).'
    },
    tickwidth: {
        valType: 'number',
        min: 0,
        editType: 'ticks',
        description: 'Sets the tick width (in px).'
    },
    scaleratio: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'plot',
        description: [
            'If this axis is linked to another by `scaleanchor`, this determines the pixel',
            'to unit scale ratio. For example, if this value is 10, then every unit on',
            'this axis spans 10 times the number of pixels as a unit on the linked axis.',
            'Use this for example to create an elevation profile where the vertical scale',
            'is exaggerated a fixed amount with respect to the horizontal.'
        ].join(' ')
    },
    nticks:  {
        valType: 'number',
        min: 0,
        // dflt: minor ? 5 : 0,
        description: [
            'Specifies the maximum number of ticks for the particular axis.',
            'The actual number of ticks will be chosen automatically to be',
            'less than or equal to `nticks`.',
            'Has an effect only if `tickmode` is set to *auto*.'
        ].join(' ')
    },
    ticklabelstep: {
        valType: 'number',
        min: 1,
        dflt: 1,
        editType: 'ticks',
        description: [
            'Sets the spacing between tick labels as compared to the spacing between ticks.',
            'A value of 1 (default) means each tick gets a label.',
            'A value of 2 means shows every 2nd label.',
            'A larger value n means only every nth tick is labeled.',
            '`tick0` determines which labels are shown.',
            'Not implemented for axes with `type` *log* or *multicategory*, or when `tickmode` is *array*.'
        ].join(' ')
    },
    spikethickness: {
        valType: 'number',
        dflt: 3,
        editType: 'none',
        description: 'Sets the width (in px) of the zero line.'
    },
    linewidth: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'ticks+layoutstyle',
        description: 'Sets the width (in px) of the axis line.'
    },
    gridwidth: {
        valType: 'number',
        dflt: 1,
        min: 0,
        editType: 'ticks',
        description: 'Sets the width (in px) of the grid lines.'
    },
    zerolinewidth: {
        valType: 'number',
        dflt: 1,
        editType: 'ticks',
        description: 'Sets the width (in px) of the zero line.'
    },
    dividerwidth: {
        valType: 'number',
        dflt: 1,
        editType: 'ticks',
        description: [
            'Sets the width (in px) of the dividers',
            'Only has an effect on *multicategory* axes.'
        ].join(' ')
    },
    position: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 0,
        editType: 'plot',
        description: [
            'Sets the position of this axis in the plotting space',
            '(in normalized coordinates).',
            'Only has an effect if `anchor` is set to *free*.'
        ].join(' ')
    },

    color: {
        valType: 'string',
        dflt: colorAttrs.defaultLine,
        description: [
            'Sets default for all colors associated with this axis',
            'all at once: line, font, tick, and grid colors.',
            'Grid color is lightened by blending this with the plot background',
            'Individual pieces can override this.'
        ].join(' ')
    },
    tick0: {
        valType: 'string',
        editType: 'ticks',
        impliedEdits: {tickmode: 'linear'},
        description: [
            'Sets the placement of the first tick on this axis.',
            'Use with `dtick`.',
            'If the axis `type` is *log*, then you must take the log of your starting tick',
            '(e.g. to set the starting tick to 100, set the `tick0` to 2)',
            'except when `dtick`=*L<f>* (see `dtick` for more info).',
            'If the axis `type` is *date*, it should be a date string, like date data.',
            'If the axis `type` is *category*, it should be a number, using the scale where',
            'each category is assigned a serial number from zero in the order it appears.'
        ].join(' ')
    },
    dtick: {
        valType: 'string',
        editType: 'ticks',
        impliedEdits: {tickmode: 'linear'},
        description: [
            'Sets the step in-between ticks on this axis. Use with `tick0`.',
            'Must be a positive number, or special strings available to *log* and *date* axes.',
            'If the axis `type` is *log*, then ticks are set every 10^(n*dtick) where n',
            'is the tick number. For example,',
            'to set a tick mark at 1, 10, 100, 1000, ... set dtick to 1.',
            'To set tick marks at 1, 100, 10000, ... set dtick to 2.',
            'To set tick marks at 1, 5, 25, 125, 625, 3125, ... set dtick to log_10(5), or 0.69897000433.',
            '*log* has several special values; *L<f>*, where `f` is a positive number,',
            'gives ticks linearly spaced in value (but not position).',
            'For example `tick0` = 0.1, `dtick` = *L0.5* will put ticks at 0.1, 0.6, 1.1, 1.6 etc.',
            'To show powers of 10 plus small digits between, use *D1* (all digits) or *D2* (only 2 and 5).',
            '`tick0` is ignored for *D1* and *D2*.',
            'If the axis `type` is *date*, then you must convert the time to milliseconds.',
            'For example, to set the interval between ticks to one day,',
            'set `dtick` to 86400000.0.',
            '*date* also has special values *M<n>* gives ticks spaced by a number of months.',
            '`n` must be a positive integer.',
            'To set ticks on the 15th of every third month, set `tick0` to *2000-01-15* and `dtick` to *M3*.',
            'To set ticks every 4 years, set `dtick` to *M48*'
        ].join(' ')
    },
    tickcolor: {
        valType: 'string',
        dflt: colorAttrs.defaultLine,
        editType: 'ticks',
        description: 'Sets the tick color.'
    },
    spikecolor: {
        valType: 'string',
        // dflt: null,
        description: 'Sets the spike color. If undefined, will use the series color'
    },
    tickprefix: {
        valType: 'string',
        dflt: '',
        editType: 'ticks',
        description: 'Sets a tick label prefix.'
    },
    ticksuffix: {
        valType: 'string',
        dflt: '',
        editType: 'ticks',
        description: 'Sets a tick label suffix.'
    },
    tickformat: {
        valType: 'string',
        dflt: '',
        editType: 'ticks',
        description: descriptionWithDates('tick label')
    },
    linecolor: {
        valType: 'string',
        dflt: colorAttrs.defaultLine,
        editType: 'layoutstyle',
        description: 'Sets the axis line color.'
    },
    gridcolor: {
        valType: 'string',
        dflt: colorAttrs.lightLine,
        editType: 'ticks',
        description: 'Sets the color of the grid lines.'
    },
    zerolinecolor: {
        valType: 'string',
        dflt: colorAttrs.defaultLine,
        editType: 'ticks',
        description: 'Sets the line color of the zero line.'
    },
    dividercolor: {
        valType: 'string',
        dflt: colorAttrs.defaultLine,
        editType: 'ticks',
        description: [
            'Sets the color of the dividers',
            'Only has an effect on *multicategory* axes.'
        ].join(' ')
    },
    hoverformat: {
        valType: 'string',
        dflt: '',
        editType: 'none',
        description: descriptionWithDates('hover text')
    },

    range: {
        valType: 'info_array',
        items: [
            {valType: 'any', editType: 'axrange', impliedEdits: {'^autorange': false}, anim: true},
            {valType: 'any', editType: 'axrange', impliedEdits: {'^autorange': false}, anim: true}
        ],
        editType: 'axrange',
        impliedEdits: {'autorange': false},
        anim: true,
        description: [
            'Sets the range of this axis.',
            'If the axis `type` is *log*, then you must take the log of your',
            'desired range (e.g. to set the range from 1 to 100,',
            'set the range from 0 to 2).',
            'If the axis `type` is *date*, it should be date strings,',
            'like date data, though Date objects and unix milliseconds',
            'will be accepted and converted to strings.',
            'If the axis `type` is *category*, it should be numbers,',
            'using the scale where each category is assigned a serial',
            'number from zero in the order it appears.'
        ].join(' ')
    },
    // scaleanchor: not used directly, just put here for reference
    // values are any opposite-letter axis id
    // constraintoward: not used directly, just put here for reference


    // ticks


    // tickvals: {
    //     valType: 'data_array',
    //     editType: 'ticks',
    //     description: [
    //         'Sets the values at which ticks on this axis appear.',
    //         'Only has an effect if `tickmode` is set to *array*.',
    //         'Used with `ticktext`.'
    //     ].join(' ')
    // },
    // ticktext: {
    //     valType: 'data_array',
    //     editType: 'ticks',
    //     description: [
    //         'Sets the text displayed at the ticks position via `tickvals`.',
    //         'Only has an effect if `tickmode` is set to *array*.',
    //         'Used with `tickvals`.'
    //     ].join(' ')
    // },

    automargin: {
        valType: 'flaglist',
        flags: ['height', 'width', 'left', 'right', 'top', 'bottom'],
        extras: [true, false],
        dflt: false,
        editType: 'ticks',
        description: [
            'Determines whether long tick labels automatically grow the figure',
            'margins.'
        ].join(' ')
    },
    // spikedash: extendFlat({}, dash, {dflt: 'dash', editType: 'none'}),
    spikemode: {
        valType: 'flaglist',
        flags: ['toaxis', 'across', 'marker'],
        dflt: 'toaxis',
        editType: 'none',
        description: [
            'Determines the drawing mode for the spike line',
            'If *toaxis*, the line is drawn from the data point to the axis the ',
            'series is plotted on.',

            'If *across*, the line is drawn across the entire plot area, and',
            'supercedes *toaxis*.',

            'If *marker*, then a marker dot is drawn on the axis the series is',
            'plotted on'
        ].join(' ')
    },
    // tickfont: fontAttrs({
    //     editType: 'ticks',
    //     description: 'Sets the tick font.'
    // }),
    tickangle: {
        valType: 'angle',
        dflt: 'auto',
        editType: 'ticks',
        description: [
            'Sets the angle of the tick labels with respect to the horizontal.',
            'For example, a `tickangle` of -90 draws the tick labels',
            'vertically.'
        ].join(' ')
    },

    // tickformatstops: templatedArray('tickformatstop', {
    //     enabled: {
    //         valType: 'boolean',
    //         dflt: true,
    //         editType: 'ticks',
    //         description: [
    //             'Determines whether or not this stop is used.',
    //             'If `false`, this stop is ignored even within its `dtickrange`.'
    //         ].join(' ')
    //     },
    //     dtickrange: {
    //         valType: 'info_array',
    //         items: [
    //             {valType: 'any', editType: 'ticks'},
    //             {valType: 'any', editType: 'ticks'}
    //         ],
    //         editType: 'ticks',
    //         description: [
    //             'range [*min*, *max*], where *min*, *max* - dtick values',
    //             'which describe some zoom level, it is possible to omit *min*',
    //             'or *max* value by passing *null*'
    //         ].join(' ')
    //     },
    //     value: {
    //         valType: 'string',
    //         dflt: '',
    //         editType: 'ticks',
    //         description: [
    //             'string - dtickformat for described zoom level, the same as *tickformat*'
    //         ].join(' ')
    //     },
    //     editType: 'ticks'
    // }),
    // lines and grids

    // griddash: griddash,


    // TODO dividerlen: that would override "to label base" length?

    // positioning attributes
    // anchor: not used directly, just put here for reference
    // values are any opposite-letter axis id
    // anchor: {
    //     valType: 'enumerated',
    //     values: [
    //         'free',
    //         constants.idRegex.x.toString(),
    //         constants.idRegex.y.toString()
    //     ],
    //     editType: 'plot',
    //     description: [
    //         'If set to an opposite-letter axis id (e.g. `x2`, `y`), this axis is bound to',
    //         'the corresponding opposite-letter axis.',
    //         'If set to *free*, this axis\' position is determined by `position`.'
    //     ].join(' ')
    // },
    // side: not used directly, as values depend on direction
    // values are top, bottom for x axes, and left, right for y
    // overlaying: not used directly, just put here for reference
    // values are false and any other same-letter axis id that's not
    // itself overlaying anything
    // overlaying: {
    //     valType: 'enumerated',
    //     values: [
    //         'free',
    //         constants.idRegex.x.toString(),
    //         constants.idRegex.y.toString()
    //     ],
    //     editType: 'plot',
    //     description: [
    //         'If set a same-letter axis id, this axis is overlaid on top of',
    //         'the corresponding same-letter axis, with traces and axes visible for both',
    //         'axes.',
    //         'If *false*, this axis does not overlay any same-letter axes.',
    //         'In this case, for axes with overlapping domains only the highest-numbered',
    //         'axis will be visible.'
    //     ].join(' ')
    // },

    // minor: {
    //     tickmode: tickmode,
    //     nticks: makeNticks('minor'),
    //     tick0: tick0,
    //     dtick: dtick,
    //     tickvals: tickvals,
    //     ticks: ticks,
    //     ticklen: makeTicklen('minor'),
    //     tickwidth: makeTickwidth('minor'),
    //     tickcolor: tickcolor,
    //
    //     gridcolor: gridcolor,
    //     gridwidth: makeGridwidth('minor'),
    //     griddash: griddash,
    //     showgrid: showgrid,
    //
    //     editType: 'ticks'
    // },

    domain: {
        valType: 'info_array',
        items: [
            {valType: 'number', min: 0, max: 1, editType: 'plot'},
            {valType: 'number', min: 0, max: 1, editType: 'plot'}
        ],
        dflt: [0, 1],
        editType: 'plot',
        description: [
            'Sets the domain of this axis (in plot fraction).'
        ].join(' ')
    },
    categoryarray: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'Sets the order in which categories on this axis appear.',
            'Only has an effect if `categoryorder` is set to *array*.',
            'Used with `categoryorder`.'
        ].join(' ')
    },

    // _deprecated: {
    //     autotick: {
    //         valType: 'boolean',
    //         editType: 'ticks',
    //         description: [
    //             'Obsolete.',
    //             'Set `tickmode` to *auto* for old `autotick` *true* behavior.',
    //             'Set `tickmode` to *linear* for `autotick` *false*.'
    //         ].join(' ')
    //     },
    //     title: {
    //         valType: 'string',
    //         editType: 'ticks',
    //         description: [
    //             'Value of `title` is no longer a simple *string* but a set of sub-attributes.',
    //             'To set the axis\' title, please use `title.text` now.'
    //         ].join(' ')
    //     },
    //     titlefont: fontAttrs({
    //         editType: 'ticks',
    //         description: [
    //             'Former `titlefont` is now the sub-attribute `font` of `title`.',
    //             'To customize title font properties, please use `title.font` now.'
    //         ].join(' ')
    //     })
    // }
}

const layoutAttributes = {
    //boolean
    autosize: {
        valType: 'boolean',
        dflt: false,
        // autosize, width, and height get special editType treatment in _relayout
        // so we can handle noop resizes more efficiently
        editType: 'none',
        description: [
            'Determines whether or not a layout width or height',
            'that has been left undefined by the user',
            'is initialized on each relayout.',

            'Note that, regardless of this attribute,',
            'an undefined layout width or height',
            'is always initialized on the first call to plot.'
        ].join(' ')
    },
    hidesources: {
        valType: 'boolean',
        dflt: false,
        description: [
            'Determines whether or not a text link citing the data source is',
            'placed at the bottom-right cored of the figure.',
            'Has only an effect only on graphs that have been generated via',
            'forked graphs from the Chart Studio Cloud (at https://chart-studio.plotly.com or on-premise).'
        ].join(' ')
    },
    showlegend: {
        // handled in legend.supplyLayoutDefaults
        // but included here because it's not in the legend object
        valType: 'boolean',
        editType: 'legend',
        dflt: true,
        description: [
            'Determines whether or not a legend is drawn.',
            'Default is `true` if there is a trace to show and any of these:',
            'a) Two or more traces would by default be shown in the legend.',
            'b) One pie trace is shown in the legend.',
            'c) One trace is explicitly given with `showlegend: true`.'
        ].join(' ')
    },
    uirevision: {
        valType: 'boolean',
        dflt: true,
        description: [
            'Used to allow user interactions with the plot to persist after',
            '`Plotly.react` calls that are unaware of these interactions.',
            'If `uirevision` is omitted, or if it is given and it changed from',
            'the previous `Plotly.react` call, the exact new figure is used.',
            'If `uirevision` is truthy and did NOT change, any attribute',
            'that has been affected by user interactions and did not receive a',
            'different value in the new figure will keep the interaction value.',
            '`layout.uirevision` attribute serves as the default for',
            '`uirevision` attributes in various sub-containers. For finer',
            'control you can set these sub-attributes directly. For example,',
            'if your app separately controls the data on the x and y axes you',
            'might set `xaxis.uirevision=*time*` and `yaxis.uirevision=*cost*`.',
            'Then if only the y data is changed, you can update',
            '`yaxis.uirevision=*quantity*` and the y axis range will reset but',
            'the x axis range will retain any user-driven zoom.'
        ].join(' ')
    },

    // font: globalFont,
    width: {
        valType: 'number',
        min: 10,
        dflt: 700,
        description: [
            'Sets the plot\'s width (in px).'
        ].join(' ')
    },
    height: {
        valType: 'number',
        min: 10,
        dflt: 450,
        description: [
            'Sets the plot\'s height (in px).'
        ].join(' ')
    },
    minreducedwidth: {
        valType: 'number',
        min: 2,
        dflt: 64,
        description: 'Minimum width of the plot with margin.automargin applied (in px)'
    },
    minreducedheight: {
        valType: 'number',
        min: 2,
        dflt: 64,
        description: 'Minimum height of the plot with margin.automargin applied (in px)'
    },
    computed: {
        valType: 'any',
        editType: 'none',
        description: [
            'Placeholder for exporting automargin-impacting values namely',
            '`margin.t`, `margin.b`, `margin.l` and `margin.r` in *full-json* mode.',
        ].join(' ')
    },
    paper_bgcolor: {
        valType: 'string',
        dflt: colorAttrs.background,
        description: 'Sets the background color of the paper where the graph is drawn.'
    },
    plot_bgcolor: {
        // defined here, but set in cartesian.supplyLayoutDefaults
        // because it needs to know if there are (2D) axes or not
        valType: 'string',
        dflt: colorAttrs.background,
        description: [
            'Sets the background color of the plotting area in-between x and y axes.'
        ].join(' ')
    },
    autotypenumbers: {
        valType: 'enumerated',
        values: ['convert types', 'strict'],
        dflt: 'convert types',
        description: [
            'Using *strict* a numeric string in trace data is not converted to a number.',
            'Using *convert types* a numeric string in trace data may be',
            'treated as a number during automatic axis `type` detection.',
            'This is the default value; however it could be overridden for individual axes.'
        ].join(' ')
    },
    separators: {
        valType: 'string',
        description: [
            'Sets the decimal and thousand separators.',
            'For example, *. * puts a \'.\' before decimals and a space',
            'between thousands. In English locales, dflt is *.,* but',
            'other locales may alter this default.'
        ].join(' ')
    },

    //
    colorway: {
        valType: 'colorlist',
        dflt: colorAttrs.defaults,
        editType: 'calc',
        description: 'Sets the default trace colors.'
    },
    // datarevision: {
    //     valType: 'any',
    //     editType: 'calc',
    //     description: [
    //         'If provided, a changed value tells `Plotly.react` that',
    //         'one or more data arrays has changed. This way you can modify',
    //         'arrays in-place rather than making a complete new copy for an',
    //         'incremental change.',
    //         'If NOT provided, `Plotly.react` assumes that data arrays are',
    //         'being treated as immutable, thus any data array with a',
    //         'different identity from its predecessor contains new data.'
    //     ].join(' ')
    // },
    // editrevision: {
    //     valType: 'any',
    //     editType: 'none',
    //     description: [
    //         'Controls persistence of user-driven changes in `editable: true`',
    //         'configuration, other than trace names and axis titles.',
    //         'Defaults to `layout.uirevision`.'
    //     ].join(' ')
    // },
    // selectionrevision: {
    //     valType: 'any',
    //     editType: 'none',
    //     description: [
    //         'Controls persistence of user-driven changes in selected points',
    //         'from all traces.'
    //     ].join(' ')
    // },
    // template: {
    //     valType: 'any',
    //     editType: 'calc',
    //     description: [
    //         'Default attributes to be applied to the plot. Templates can be',
    //         'created from existing plots using `Plotly.makeTemplate`, or',
    //         'created manually. They should be objects with format:',
    //         '`{layout: layoutTemplate, data: {[type]: [traceTemplate, ...]}, ...}`',
    //         '`layoutTemplate` and `traceTemplate` are objects matching the',
    //         'attribute structure of `layout` and a data trace. ',
    //         'Trace templates are applied cyclically to traces of each type.',
    //         'Container arrays (eg `annotations`) have special handling:',
    //         'An object ending in `defaults` (eg `annotationdefaults`) is applied',
    //         'to each array item. But if an item has a `templateitemname` key',
    //         'we look in the template array for an item with matching `name` and',
    //         'apply that instead. If no matching `name` is found we mark the item',
    //         'invisible. Any named template item not referenced is appended to',
    //         'the end of the array, so you can use this for a watermark annotation',
    //         'or a logo image, for example. To omit one of these items on the plot,',
    //         'make an item with matching `templateitemname` and `visible: false`.'
    //     ].join(' ')
    // },

    // newshape: drawNewShapeAttrs.newshape,
    // activeshape: drawNewShapeAttrs.activeshape,

    // newselection: drawNewSelectionAttrs.newselection,
    // activeselection: drawNewSelectionAttrs.activeselection,

    meta: {
        valType: 'any',
        arrayOk: true,
        editType: 'plot',
        description: [
            'Assigns extra meta information that can be used in various `text` attributes.',
            'Attributes such as the graph, axis and colorbar `title.text`, annotation `text`',
            '`trace.name` in legend items, `rangeselector`, `updatemenus` and `sliders` `label` text',
            'all support `meta`. One can access `meta` fields using template strings:',
            '`%{meta[i]}` where `i` is the index of the `meta`',
            'item in question.',
            '`meta` can also be an object for example `{key: value}` which can be accessed',
            '%{meta[key]}.'
        ].join(' ')
    },
    //
    // // transition: extendFlat({}, animationAttrs.transition, {
    // //     description: [
    // //         'Sets transition options used during Plotly.react updates.'
    // //     ].join(' '),
    // //     editType: 'none'
    // // }),
    // _deprecated: {
    //     title: {
    //         valType: 'string',
    //         editType: 'layoutstyle',
    //         description: [
    //             'Value of `title` is no longer a simple *string* but a set of sub-attributes.',
    //             'To set the contents of the title, please use `title.text` now.'
    //         ].join(' ')
    //     },
    //     // titlefont: fontAttrs({
    //     //     editType: 'layoutstyle',
    //     //     description: [
    //     //         'Former `titlefont` is now the sub-attribute `font` of `title`.',
    //     //         'To customize title font properties, please use `title.font` now.'
    //     //     ].join(' ')
    //     // })
    // }
    title: {
        // text: {
        //     valType: 'string',
        //     dflt: 'title',
        //     editType: 'layoutstyle',
        //     description: [
        //         'Sets the plot\'s title.',
        //         'Note that before the existence of `title.text`, the title\'s',
        //         'contents used to be defined as the `title` attribute itself.',
        //         'This behavior has been deprecated.'
        //     ].join(' ')
        // },
        // // font: fontAttrs({
        // //     editType: 'layoutstyle',
        // //     description: [
        // //         'Sets the title font.',
        // //         'Note that the title\'s font used to be customized',
        // //         'by the now deprecated `titlefont` attribute.'
        // //     ].join(' ')
        // // }),
        xref: {
            valType: 'enumerated',
            dflt: 'container',
            values: ['container', 'paper'],
            editType: 'layoutstyle',
            description: [
                'Sets the container `x` refers to.',
                '*container* spans the entire `width` of the plot.',
                '*paper* refers to the width of the plotting area only.'
            ].join(' ')
        },
        yref: {
            valType: 'enumerated',
            dflt: 'container',
            values: ['container', 'paper'],
            editType: 'layoutstyle',
            description: [
                'Sets the container `y` refers to.',
                '*container* spans the entire `height` of the plot.',
                '*paper* refers to the height of the plotting area only.'
            ].join(' ')
        },
        x: {
            valType: 'number',
            min: 0,
            max: 1,
            dflt: 0.5,
            editType: 'layoutstyle',
            description: [
                'Sets the x position with respect to `xref` in normalized',
                'coordinates from *0* (left) to *1* (right).'
            ].join(' ')
        },
        y: {
            valType: 'number',
            min: 0,
            max: 1,
            dflt: 'auto',
            editType: 'layoutstyle',
            description: [
                'Sets the y position with respect to `yref` in normalized',
                'coordinates from *0* (bottom) to *1* (top).',
                '*auto* places the baseline of the title onto the',
                'vertical center of the top margin.'
            ].join(' ')
        },
        xanchor: {
            valType: 'enumerated',
            dflt: 'auto',
            values: ['auto', 'left', 'center', 'right'],
            editType: 'layoutstyle',
            description: [
                'Sets the title\'s horizontal alignment with respect to its x position.',
                '*left* means that the title starts at x,',
                '*right* means that the title ends at x',
                'and *center* means that the title\'s center is at x.',
                '*auto* divides `xref` by three and calculates the `xanchor`',
                'value automatically based on the value of `x`.'
            ].join(' ')
        },
        yanchor: {
            valType: 'enumerated',
            dflt: 'auto',
            values: ['auto', 'top', 'middle', 'bottom'],
            editType: 'layoutstyle',
            description: [
                'Sets the title\'s vertical alignment with respect to its y position.',
                '*top* means that the title\'s cap line is at y,',
                '*bottom* means that the title\'s baseline is at y',
                'and *middle* means that the title\'s midline is at y.',
                '*auto* divides `yref` by three and calculates the `yanchor`',
                'value automatically based on the value of `y`.'
            ].join(' ')
        },
        // pad: extendFlat(padAttrs({editType: 'layoutstyle'}), {
        //     description: [
        //         'Sets the padding of the title.',
        //         'Each padding value only applies when the corresponding',
        //         '`xanchor`/`yanchor` value is set accordingly. E.g. for left',
        //         'padding to take effect, `xanchor` must be set to *left*.',
        //         'The same rule applies if `xanchor`/`yanchor` is determined automatically.',
        //         'Padding is muted if the respective anchor value is *middle*/*center*.'
        //     ].join(' ')
        // }),
        // editType: 'layoutstyle'
    },
    uniformtext: {
        mode: {
            valType: 'enumerated',
            values: [false, 'hide', 'show'],
            dflt: false,
            editType: 'plot',
            description: [
                'Determines how the font size for various text',
                'elements are uniformed between each trace type.',
                'If the computed text sizes were smaller than',
                'the minimum size defined by `uniformtext.minsize`',
                'using *hide* option hides the text; and',
                'using *show* option shows the text without further downscaling.',
                'Please note that if the size defined by `minsize` is greater than',
                'the font size defined by trace, then the `minsize` is used.'
            ].join(' ')
        },
        minsize: {
            valType: 'number',
            min: 0,
            dflt: 0,
            editType: 'plot',
            description: [
                'Sets the minimum text size between traces of the same type.'
            ].join(' ')
        },
        // editType: 'plot'
    },
    margin: {
        autoexpand: {
            valType: 'boolean',
            dflt: true,
            editType: 'plot',
            description: [
                'Turns on/off margin expansion computations.',
                'Legends, colorbars, updatemenus, sliders, axis rangeselector and rangeslider',
                'are allowed to push the margins by defaults.'
            ].join(' ')
        },
        l: {
            valType: 'number',
            min: 0,
            dflt: 80,
            editType: 'plot',
            description: 'Sets the left margin (in px).'
        },
        r: {
            valType: 'number',
            min: 0,
            dflt: 80,
            editType: 'plot',
            description: 'Sets the right margin (in px).'
        },
        t: {
            valType: 'number',
            min: 0,
            dflt: 100,
            editType: 'plot',
            description: 'Sets the top margin (in px).'
        },
        b: {
            valType: 'number',
            min: 0,
            dflt: 80,
            editType: 'plot',
            description: 'Sets the bottom margin (in px).'
        },
        pad: {
            valType: 'number',
            min: 0,
            dflt: 0,
            editType: 'plot',
            description: [
                'Sets the amount of padding (in px)',
                'between the plotting area and the axis lines'
            ].join(' ')
        },
    },
    xaxis: axis_attributes,
    yaxis: axis_attributes,
    //custom json
    CustomSettings: {
        json:{
            valType: 'custom',
            dflt: {},
            description: [
                'This may be used to add any other settings from Plotly.js',
            ].join(' ')
        }
    },
};

var dfltLayoutAttributes = {};

function crawl(src, target) {
    for(var k in src) {
        var obj = src[k];
        if(obj.valType) {
            if(obj.dflt) {
                target[k] = obj.dflt;
            }
        } else {
            if(!target[k]) {
                target[k] = {};
            }
            crawl(obj, target[k]);
        }
    }
}

crawl(layoutAttributes, dfltLayoutAttributes);
