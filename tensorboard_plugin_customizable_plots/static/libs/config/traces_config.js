

/**
 * This will be transferred over to gd and overridden by
 * config args to Plotly.newPlot.
 *
 * The defaults are the appropriate settings for plotly.js,
 * so we get the right experience without any config argument.
 *
 * N.B. the config options are not coerced using Lib.coerce so keys
 * like `valType` and `values` are only set for documentation purposes
 * at the moment.
 *
 * /tensorboard_plugin_customizable_plots/plots/attributes.js
 *
 */

function axisPeriod(axis) {
    return {
        valType: 'any',
        dflt: 0,
        editType: 'calc',
        description: [
            'Only relevant when the axis `type` is *date*.',
            'Sets the period positioning in milliseconds or *M<n>* on the ' + axis + ' axis.',
            'Special values in the form of *M<n>* could be used to declare',
            'the number of months. In this case `n` must be a positive integer.'
        ].join(' ')
    };
}

function axisPeriod0(axis) {
    return {
        valType: 'any',
        editType: 'calc',
        description: [
            'Only relevant when the axis `type` is *date*.',
            'Sets the base for period positioning in milliseconds or date string on the ' + axis + ' axis.',
            'When `' + axis + 'period` is round number of weeks,',
            'the `' + axis + 'period0` by default would be on a Sunday i.e. 2000-01-02,',
            'otherwise it would be at 2000-01-01.'
        ].join(' ')
    };
}

function axisPeriodAlignment(axis) {
    return {
        valType: 'enumerated',
        values: [
            'start', 'middle', 'end'
        ],
        dflt: 'middle',
        editType: 'calc',
        description: [
            'Only relevant when the axis `type` is *date*.',
            'Sets the alignment of data points on the ' + axis + ' axis.'
        ].join(' ')
    };
}

var tracesAttributes = {
    //boolean
    showlegend: {
        valType: 'boolean',
        dflt: true,
        editType: 'style',
        description: [
            'Determines whether or not an item corresponding to this',
            'trace is shown in the legend.'
        ].join(' ')
    },

    type: {
        valType: 'string',
        values: [],     // listed dynamically
        dflt: 'scatter',
        editType: 'calc+clearAxisTypes',
        _noTemplating: true // we handle this at a higher level
    },
    mode: {
        valType: 'string',
        flags: ['lines', 'markers', 'text'],
        extras: ['none'],
        editType: 'calc',
        dflt: 'lines+points',
        description: [
            'Determines the drawing mode for this scatter trace.',
            'If the provided `mode` includes *text* then the `text` elements',
            'appear at the coordinates. Otherwise, the `text` elements',
            'appear on hover.',
            'If there are less than ' + 20 + ' points',
            'and the trace is not stacked',
            'then the default is *lines+markers*. Otherwise, *lines*.',
            `\nflags: ${['lines', 'markers', 'text', 'none']}`
        ].join(' ')
    },

    //enumerated
    visible: {
        valType: 'enumerated',
        values: [true, false, 'legendonly'],
        dflt: true,
        editType: 'calc',
        description: [
            'Determines whether or not this trace is visible.',
            'If *legendonly*, the trace is not drawn,',
            'but can appear as a legend item',
            '(provided that the legend itself is visible).'
        ].join(' ')
    },
    orientation: {
        valType: 'enumerated',
        values: ['v', 'h'],
        editType: 'calc',
        description: [
            'Only relevant when `stackgroup` is used, and only the first',
            '`orientation` found in the `stackgroup` will be used - including',
            'if `visible` is *legendonly* but not if it is `false`. Sets the',
            'stacking direction. With *v* (*h*), the y (x) values of subsequent',
            'traces are added. Also affects the default value of `fill`.'
        ].join(' ')
    },
    groupnorm: {
        valType: 'enumerated',
        values: ['', 'fraction', 'percent'],
        dflt: '',
        editType: 'calc',
        description: [
            'Only relevant when `stackgroup` is used, and only the first',
            '`groupnorm` found in the `stackgroup` will be used - including',
            'if `visible` is *legendonly* but not if it is `false`.',
            'Sets the normalization for the sum of this `stackgroup`.',
            'With *fraction*, the value of each trace at each location is',
            'divided by the sum of all trace values at that location.',
            '*percent* is the same but multiplied by 100 to show percentages.',
            'If there are multiple subplots, or multiple `stackgroup`s on one',
            'subplot, each will be normalized within its own set.'
        ].join(' ')
    },
    stackgaps: {
        valType: 'enumerated',
        values: ['infer zero', 'interpolate'],
        dflt: 'infer zero',
        editType: 'calc',
        description: [
            'Only relevant when `stackgroup` is used, and only the first',
            '`stackgaps` found in the `stackgroup` will be used - including',
            'if `visible` is *legendonly* but not if it is `false`.',
            'Determines how we handle locations at which other traces in this',
            'group have data but this one does not.',
            'With *infer zero* we insert a zero at these locations.',
            'With *interpolate* we linearly interpolate between existing',
            'values, and extrapolate a constant beyond the existing values.'
            // TODO - implement interrupt mode
            // '*interrupt* omits this trace from the stack at this location by',
            // 'dropping abruptly, midway between the existing and missing locations.'
        ].join(' ')
    },

    //string
    legendgroup: {
        valType: 'string',
        dflt: '',
        editType: 'style',
        description: [
            'Sets the legend group for this trace.',
            'Traces part of the same legend group hide/show at the same time',
            'when toggling legend items.'
        ].join(' ')
    },
    stackgroup: {
        valType: 'string',
        dflt: '',
        editType: 'calc',
        description: [
            'Set several scatter traces (on the same subplot) to the same',
            'stackgroup in order to add their y values (or their x values if',
            '`orientation` is *h*). If blank or omitted this trace will not be',
            'stacked. Stacking also turns `fill` on by default, using *tonexty*',
            '(*tonextx*) if `orientation` is *h* (*v*) and sets the default',
            '`mode` to *lines* irrespective of point count.',
            'You can only stack on a numeric (linear or log) axis.',
            'Traces in a `stackgroup` will only fill to (or be filled to) other',
            'traces in the same group. With multiple `stackgroup`s or some',
            'traces stacked and some not, if fill-linked traces are not already',
            'consecutive, the later ones will be pushed down in the drawing order.'
        ].join(' ')
    },
    hovertext: {
        valType: 'string',
        dflt: '',
        arrayOk: true,
        editType: 'style',
        description: [
            'Sets hover text elements associated with each (x,y) pair.',
            'If a single string, the same string appears over',
            'all the data points.',
            'If an array of string, the items are mapped in order to the',
            'this trace\'s (x,y) coordinates.',
            'To be seen, trace `hoverinfo` must contain a *text* flag.'
        ].join(' ')
    },
    hoveron: {
        valType: 'string',
        flags: ['points', 'fills'],
        editType: 'style',
        description: [
            'Do the hover effects highlight individual points (markers or',
            'line points) or do they highlight filled regions?',
            'If the fill is *toself* or *tonext* and there are no markers',
            'or text, then the default is *fills*, otherwise it is *points*.'
        ].join(' ')
    },

    //number
    legendrank: {
        valType: 'number',
        dflt: 1000,
        editType: 'style',
        description: [
            'Sets the legend rank for this trace.',
            'Items and groups with smaller ranks are presented on top/left side while',
            'with `*reversed* `legend.traceorder` they are on bottom/right side.',
            'The default legendrank is 1000,',
            'so that you can use ranks less than 1000 to place certain items before all unranked items,',
            'and ranks greater than 1000 to go after all unranked items.'
        ].join(' ')
    },
    legendwidth: {
        valType: 'number',
        min: 0,
        editType: 'style',
        description: 'Sets the width (in px or fraction) of the legend for this trace.',
    },
    opacity: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 1,
        editType: 'style',
        description: 'Sets the opacity of the trace.'
    },

    // name: {
    //     valType: 'string',
    //     editType: 'style',
    //     description: [
    //         'Sets the trace name.',
    //         'The trace name appear as the legend item and on hover.'
    //     ].join(' ')
    // },
    // uid: {
    //     valType: 'string',
    //     editType: 'plot',
    //     anim: true,
    //     description: [
    //         'Assign an id to this trace,',
    //         'Use this to provide object constancy between traces during animations',
    //         'and transitions.'
    //     ].join(' ')
    // },
    // ids: {
    //     valType: 'data_array',
    //     editType: 'calc',
    //     anim: true,
    //     description: [
    //         'Assigns id labels to each datum.',
    //         'These ids for object constancy of data points during animation.',
    //         'Should be an array of strings, not numbers or any other type.'
    //     ].join(' ')
    // },
    // customdata: {
    //     valType: 'data_array',
    //     editType: 'calc',
    //     description: [
    //         'Assigns extra data each datum.',
    //         'This may be useful when listening to hover, click and selection events.',
    //         'Note that, *scatter* traces also appends customdata items in the markers',
    //         'DOM elements'
    //     ].join(' ')
    // },
    // meta: {
    //     valType: 'any',
    //     arrayOk: true,
    //     editType: 'plot',
    //     description: [
    //         'Assigns extra meta information associated with this trace',
    //         'that can be used in various text attributes.',
    //         'Attributes such as trace `name`, graph, axis and colorbar `title.text`, annotation `text`',
    //         '`rangeselector`, `updatemenues` and `sliders` `label` text',
    //         'all support `meta`.',
    //         'To access the trace `meta` values in an attribute in the same trace, simply use',
    //         '`%{meta[i]}` where `i` is the index or key of the `meta`',
    //         'item in question.',
    //         'To access trace `meta` in layout attributes, use',
    //         '`%{data[n[.meta[i]}` where `i` is the index or key of the `meta`',
    //         'and `n` is the trace index.'
    //     ].join(' ')
    // },
    //
    // // N.B. these cannot be 'data_array' as they do not have the same length as
    // // other data arrays and arrayOk attributes in general
    // //
    // // Maybe add another valType:
    // // https://github.com/plotly/plotly.js/issues/1894
    // selectedpoints: {
    //     valType: 'any',
    //     editType: 'calc',
    //     description: [
    //         'Array containing integer indices of selected points.',
    //         'Has an effect only for traces that support selections.',
    //         'Note that an empty array means an empty selection where the `unselected`',
    //         'are turned on for all points, whereas, any other non-array values means no',
    //         'selection all where the `selected` and `unselected` styles have no effect.'
    //     ].join(' ')
    // },
    //
    hoverinfo: {
        valType: 'string',
        flags: ['x', 'y', 'z', 'text', 'name'],
        extras: ['all', 'none', 'skip'],
        arrayOk: true,
        dflt: 'all',
        editType: 'none',
        description: [
            'Determines which trace information appear on hover.',
            'If `none` or `skip` are set, no information is displayed upon hovering.',
            'But, if `none` is set, click and hover events are still fired.',
            `flags: ${['x', 'y', 'z', 'text', 'name']}`,
            `$extras: {['all', 'none', 'skip']}`
        ].join(' ')
    },
    // // hoverlabel: fxAttrs.hoverlabel,
    // stream: {
    //     token: {
    //         valType: 'string',
    //         noBlank: true,
    //         strict: true,
    //         editType: 'calc',
    //         description: [
    //             'The stream id number links a data trace on a plot with a stream.',
    //             'See https://chart-studio.plotly.com/settings for more details.'
    //         ].join(' ')
    //     },
    //     maxpoints: {
    //         valType: 'number',
    //         min: 0,
    //         max: 10000,
    //         dflt: 500,
    //         editType: 'calc',
    //         description: [
    //             'Sets the maximum number of points to keep on the plots from an',
    //             'incoming stream.',
    //             'If `maxpoints` is set to *50*, only the newest 50 points will',
    //             'be displayed on the plot.'
    //         ].join(' ')
    //     },
    // },
    //
    // // from scatter plot attributes
    //
    // // x: {
    // //     valType: 'data_array',
    // //     editType: 'calc+clearAxisTypes',
    // //     anim: true,
    // //     description: 'Sets the x coordinates.'
    // // },
    x0: {
        valType: 'string',
        dflt: 0,
        editType: 'calc+clearAxisTypes',
        anim: true,
        description: [
            'Alternate to `x`.',
            'Builds a linear space of x coordinates.',
            'Use with `dx`',
            'where `x0` is the starting coordinate and `dx` the step.'
        ].join(' ')
    },
    dx: {
        valType: 'number',
        dflt: 1,
        editType: 'calc',
        anim: true,
        description: [
            'Sets the x coordinate step.',
            'See `x0` for more info.'
        ].join(' ')
    },
    // // y: {
    // //     valType: 'data_array',
    // //     editType: 'calc+clearAxisTypes',
    // //     anim: true,
    // //     description: 'Sets the y coordinates.'
    // // },
    y0: {
        valType: 'string',
        dflt: 0,
        editType: 'calc+clearAxisTypes',
        anim: true,
        description: [
            'Alternate to `y`.',
            'Builds a linear space of y coordinates.',
            'Use with `dy`',
            'where `y0` is the starting coordinate and `dy` the step.'
        ].join(' ')
    },
    dy: {
        valType: 'number',
        dflt: 1,
        editType: 'calc',
        anim: true,
        description: [
            'Sets the y coordinate step.',
            'See `y0` for more info.'
        ].join(' ')
    },
    //
    xperiod: axisPeriod('x'),
    yperiod: axisPeriod('y'),
    xperiod0: axisPeriod0('x0'),
    yperiod0: axisPeriod0('y0'),
    xperiodalignment: axisPeriodAlignment('x'),
    yperiodalignment: axisPeriodAlignment('y'),
    // xhoverformat: axisHoverFormat('x'),
    // yhoverformat: axisHoverFormat('y'),


    text: {
        valType: 'string',
        dflt: '',
        arrayOk: true,
        editType: 'calc',
        description: [
            'Sets text elements associated with each (x,y) pair.',
            'If a single string, the same string appears over',
            'all the data points.',
            'If an array of string, the items are mapped in order to the',
            'this trace\'s (x,y) coordinates.',
            'If trace `hoverinfo` contains a *text* flag and *hovertext* is not set,',
            'these elements will be seen in the hover labels.'
        ].join(' ')
    },
    //
    //

    //
    line: {
        color: {
            valType: 'string',
            editType: 'style',
            anim: true,
            description: 'Sets the line color.'
        },
        width: {
            valType: 'number',
            min: 0,
            dflt: 2,
            editType: 'style',
            anim: true,
            description: 'Sets the line width (in px).'
        },
        shape: {
            valType: 'enumerated',
            values: ['linear', 'spline', 'hv', 'vh', 'hvh', 'vhv'],
            dflt: 'linear',
            editType: 'plot',
            description: [
                'Determines the line shape.',
                'With *spline* the lines are drawn using spline interpolation.',
                'The other available values correspond to step-wise line shapes.'
            ].join(' ')
        },
        smoothing: {
            valType: 'number',
            min: 0,
            max: 1.3,
            dflt: 1,
            editType: 'plot',
            description: [
                'Has an effect only if `shape` is set to *spline*',
                'Sets the amount of smoothing.',
                '*0* corresponds to no smoothing (equivalent to a *linear* shape).'
            ].join(' ')
        },
        simplify: {
            valType: 'boolean',
            dflt: true,
            editType: 'plot',
            description: [
                'Simplifies lines by removing nearly-collinear points. When transitioning',
                'lines, it may be desirable to disable this so that the number of points',
                'along the resulting SVG path is unaffected.'
            ].join(' ')
        },
    },
    legendgrouptitle: {
        text: {
            valType: 'string',
            dflt: '',
            editType: 'style',
            description: [
                'Sets the title of the legend group.'
            ].join(' ')
        },
        // font: fontAttrs({
        //     editType: 'style',
        //     description: [
        //         'Sets this legend group\'s title font.'
        //     ].join(' '),
        // }),
    },

    //
    // connectgaps: {
    //     valType: 'boolean',
    //     dflt: false,
    //     editType: 'calc',
    //     description: [
    //         'Determines whether or not gaps',
    //         '(i.e. {nan} or missing values)',
    //         'in the provided data arrays are connected.'
    //     ].join(' ')
    // },
    // cliponaxis: {
    //     valType: 'boolean',
    //     dflt: true,
    //     editType: 'plot',
    //     description: [
    //         'Determines whether or not markers and text nodes',
    //         'are clipped about the subplot axes.',
    //         'To show markers and text nodes above axis lines and tick labels,',
    //         'make sure to set `xaxis.layer` and `yaxis.layer` to *below traces*.'
    //     ].join(' ')
    // },
    //
    // fill: {
    //     valType: 'enumerated',
    //     values: ['none', 'tozeroy', 'tozerox', 'tonexty', 'tonextx', 'toself', 'tonext'],
    //     editType: 'calc',
    //     description: [
    //         'Sets the area to fill with a solid color.',
    //         'Defaults to *none* unless this trace is stacked, then it gets',
    //         '*tonexty* (*tonextx*) if `orientation` is *v* (*h*)',
    //         'Use with `fillcolor` if not *none*.',
    //         '*tozerox* and *tozeroy* fill to x=0 and y=0 respectively.',
    //         '*tonextx* and *tonexty* fill between the endpoints of this',
    //         'trace and the endpoints of the trace before it, connecting those',
    //         'endpoints with straight lines (to make a stacked area graph);',
    //         'if there is no trace before it, they behave like *tozerox* and',
    //         '*tozeroy*.',
    //         '*toself* connects the endpoints of the trace (or each segment',
    //         'of the trace if it has gaps) into a closed shape.',
    //         '*tonext* fills the space between two traces if one completely',
    //         'encloses the other (eg consecutive contour lines), and behaves like',
    //         '*toself* if there is no trace before it. *tonext* should not be',
    //         'used if one trace does not enclose the other.',
    //         'Traces in a `stackgroup` will only fill to (or be filled to) other',
    //         'traces in the same group. With multiple `stackgroup`s or some',
    //         'traces stacked and some not, if fill-linked traces are not already',
    //         'consecutive, the later ones will be pushed down in the drawing order.'
    //     ].join(' ')
    // },
    // fillcolor: {
    //     valType: 'color',
    //     editType: 'style',
    //     anim: true,
    //     description: [
    //         'Sets the fill color.',
    //         'Defaults to a half-transparent variant of the line color,',
    //         'marker color, or marker line color, whichever is available.'
    //     ].join(' ')
    // },
    // fillpattern: {
    //     valType: 'string',
    //     // string type usually doesn't take values... this one should really be
    //     // a special type or at least a special coercion function, from the GUI
    //     // you only get these values but elsewhere the user can supply a list of
    //     // dash lengths in px, and it will be honored
    //     values: ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot'],
    //     dflt: 'solid',
    //     editType: 'style',
    //     description: [
    //         'Sets the dash style of lines. Set to a dash type string',
    //         '(*solid*, *dot*, *dash*, *longdash*, *dashdot*, or *longdashdot*)',
    //         'or a dash length list in px (eg *5px,10px,2px,2px*).'
    //     ].join(' ')
    // },
    // marker:{
    //         // symbol: {
    //         //     valType: 'enumerated',
    //         //     values: Drawing.symbolList,
    //         //     dflt: 'circle',
    //         //     arrayOk: true,
    //         //     editType: 'style',
    //         //     description: [
    //         //         'Sets the marker symbol type.',
    //         //         'Adding 100 is equivalent to appending *-open* to a symbol name.',
    //         //         'Adding 200 is equivalent to appending *-dot* to a symbol name.',
    //         //         'Adding 300 is equivalent to appending *-open-dot*',
    //         //         'or *dot-open* to a symbol name.'
    //         //     ].join(' ')
    //         // },
    //         opacity: {
    //             valType: 'number',
    //             min: 0,
    //             max: 1,
    //             arrayOk: true,
    //             editType: 'style',
    //             anim: true,
    //             description: 'Sets the marker opacity.'
    //         },
    //         size: {
    //             valType: 'number',
    //             min: 0,
    //             dflt: 6,
    //             arrayOk: true,
    //             editType: 'calc',
    //             anim: true,
    //             description: 'Sets the marker size (in px).'
    //         },
    //         maxdisplayed: {
    //             valType: 'number',
    //             min: 0,
    //             dflt: 0,
    //             editType: 'plot',
    //             description: [
    //                 'Sets a maximum number of points to be drawn on the graph.',
    //                 '*0* corresponds to no limit.'
    //             ].join(' ')
    //         },
    //         sizeref: {
    //             valType: 'number',
    //             dflt: 1,
    //             editType: 'calc',
    //             description: [
    //                 'Has an effect only if `marker.size` is set to a numerical array.',
    //                 'Sets the scale factor used to determine the rendered size of',
    //                 'marker points. Use with `sizemin` and `sizemode`.'
    //             ].join(' ')
    //         },
    //         sizemin: {
    //             valType: 'number',
    //             min: 0,
    //             dflt: 0,
    //             editType: 'calc',
    //             description: [
    //                 'Has an effect only if `marker.size` is set to a numerical array.',
    //                 'Sets the minimum size (in px) of the rendered marker points.'
    //             ].join(' ')
    //         },
    //         sizemode: {
    //             valType: 'enumerated',
    //             values: ['diameter', 'area'],
    //             dflt: 'diameter',
    //             editType: 'calc',
    //             description: [
    //                 'Has an effect only if `marker.size` is set to a numerical array.',
    //                 'Sets the rule for which the data in `size` is converted',
    //                 'to pixels.'
    //             ].join(' ')
    //         },
    //
    //         line: {
    //                 width: {
    //                     valType: 'number',
    //                     min: 0,
    //                     arrayOk: true,
    //                     editType: 'style',
    //                     anim: true,
    //                     description: 'Sets the width (in px) of the lines bounding the marker points.'
    //                 },
    //             },
    //         gradient: {
    //             type: {
    //                 valType: 'enumerated',
    //                 values: ['radial', 'horizontal', 'vertical', 'none'],
    //                 arrayOk: true,
    //                 dflt: 'none',
    //                 editType: 'calc',
    //                 description: [
    //                     'Sets the type of gradient used to fill the markers'
    //                 ].join(' ')
    //             },
    //             color: {
    //                 valType: 'string',
    //                 arrayOk: true,
    //                 editType: 'calc',
    //                 description: [
    //                     'Sets the final color of the gradient fill:',
    //                     'the center color for radial, the right for horizontal,',
    //                     'or the bottom for vertical.',
    //                 ].join(' ')
    //             },
    //         },
    //     },
    //
    // selected: {
    //     marker: {
    //         opacity: {
    //             valType: 'number',
    //             min: 0,
    //             max: 1,
    //             editType: 'style',
    //             description: 'Sets the marker opacity of selected points.'
    //         },
    //         color: {
    //             valType: 'string',
    //             editType: 'style',
    //             description: 'Sets the marker color of selected points.'
    //         },
    //         size: {
    //             valType: 'number',
    //             min: 0,
    //             editType: 'style',
    //             description: 'Sets the marker size of selected points.'
    //         },
    //     },
    //     textfont: {
    //         color: {
    //             valType: 'string',
    //             editType: 'style',
    //             description: 'Sets the text font color of selected points.'
    //         },
    //     },
    // },
    // unselected: {
    //     marker: {
    //         opacity: {
    //             valType: 'number',
    //             min: 0,
    //             max: 1,
    //             editType: 'style',
    //             description: 'Sets the marker opacity of unselected points, applied only when a selection exists.'
    //         },
    //         color: {
    //             valType: 'string',
    //             editType: 'style',
    //             description: 'Sets the marker color of unselected points, applied only when a selection exists.'
    //         },
    //         size: {
    //             valType: 'number',
    //             min: 0,
    //             editType: 'style',
    //             description: 'Sets the marker size of unselected points, applied only when a selection exists.'
    //         },
    //     },
    //     textfont: {
    //         color: {
    //             valType: 'string',
    //             editType: 'style',
    //             description: 'Sets the text font color of unselected points, applied only when a selection exists.'
    //         },
    //     },
    // },
    //
    // textposition: {
    //     valType: 'enumerated',
    //     values: [
    //         'top left', 'top center', 'top right',
    //         'middle left', 'middle center', 'middle right',
    //         'bottom left', 'bottom center', 'bottom right'
    //     ],
    //     dflt: 'middle center',
    //     arrayOk: true,
    //     editType: 'calc',
    //     description: [
    //         'Sets the positions of the `text` elements',
    //         'with respects to the (x,y) coordinates.'
    //     ].join(' ')
    // },
    // textfont: fontAttrs({
    //     editType: 'calc',
    //     colorEditType: 'style',
    //     arrayOk: true,
    //     description: 'Sets the text font.'
    // }),
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

var dfltTracesConfig = {};

function crawl(src, target) {
    for(var k in src) {
        var obj = src[k];
        if(obj.valType) {
            target[k] = obj.dflt;
        } else {
            if(!target[k]) {
                target[k] = {};
            }
            crawl(obj, target[k]);
        }
    }
}

crawl(tracesAttributes, dfltTracesConfig);
