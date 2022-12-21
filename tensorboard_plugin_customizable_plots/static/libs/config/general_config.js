'use strict';

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
 */

var generalConfigAttributes = {
    // enumerated
    horizontalAxis:  {
        valType: 'enumerated',
        values: ['Step', 'Time'],
        dflt: 'Step',
        description: [
            'Sets the Horizontal axis (x axis) to',
            'Step or Time values'
        ].join(' ')
    },

    autoReload: {
        valType: 'boolean',
        dflt: false,
        description: [
            'Automatically reloads data from Tensorboard',
        ].join(' ')
    },

    autoReloadInterval: {
        valType: 'number',
        dflt: 30,
        min: 0,
        description: [
            'Sets the autoReload Interval',
            'when autoReload is set to true',
        ].join(' ')
    },

};

var dflGeneralConfigAttributes = {};

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

crawl(generalConfigAttributes, dflGeneralConfigAttributes);
