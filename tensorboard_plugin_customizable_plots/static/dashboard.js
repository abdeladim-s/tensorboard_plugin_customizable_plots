
/**
 * Copyright 2022 Abdeladim S.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * server calls
 */

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response.json();
}

async function getTags() {
    let tags = (await fetchJSON(`../tags`)) || {};
    return tags;
}

async function getRuns() {
    let runs = (await fetchJSON(`../runs`)) || {};
    return runs;
}

async function getData(ha) {
    const params = new URLSearchParams({ha});
    let data = (await fetchJSON(`../data?${params}`)) || {};
    return data;
}

/**========================================================================================================*/
/**
* Utils
* */

/**
 *
 * @param {Function} callback
 * @param {number|null} delay, stopped when delay is null
 */
function useInterval(callback, delay) {
    const savedCallback = React.useRef();

    React.useEffect(() => {
        savedCallback.current = callback;
    });

    React.useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay * 1000);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const getValue = (obj, chain, i=0) => {

    if(i == chain.length - 1){
        return obj[chain[i]];
    }
    else  {
        return getValue(obj[chain[i]], chain, i+1)
    }

}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

const getInitConfig = (key, dflt) => {
    let conf = localStorage.getItem(key);
    if(conf){
        let p = JSON.parse(conf);
        return {...dflt, ...p};
    }
    else{
        return dflt
    }
}

const resetSettings = () => {
    // removing all stored settings
    localStorage.clear();
    // refresh the page. dflt settings will automatically loaded
    location.reload();
}

const modifyObject = (obj, chain, value, i=0) => {
    if(i == chain.length - 1){
        obj[chain[i]] = value
    }
    else  {
        modifyObject(obj[chain[i]], chain, value, i+1)
    }
}

/**========================================================================================================*/

/**
 * Constants
 */
const PARENT_DELIMITER = '$/';
const github_url = "https://github.com/abdeladim-s/tensorboard_plugin_customizable_plots";

const defaultRunsDrawerWidth = 280;
const minRunsDrawerWidth = 200;
const maxRunsDrawerWidth = 400;
const defaultSettingsDrawerWidth = 300;
const minSettingsDrawerWidth = 200;
const maxSettingsDrawerWidth = 400;

// Init configs
const initPlotConfig = getInitConfig('plotConfig', dfltConfig);
const initLayoutConfig = getInitConfig('layoutConfig', dfltLayoutAttributes);
const initGeneralConfig = getInitConfig('generalConfig', dflGeneralConfigAttributes);
const initRunsConfig = getInitConfig('runsConfig', {});
const initDeactivatedRuns = getInitConfig('deactivatedRuns', {});
/**========================================================================================================*/

/**
 * Imports
 */

const {
    alpha,
    TextField,
    Tooltip,
    Switch,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormControlLabel,
    Checkbox,
    AppBar,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    ListItem,
    IconButton,
    Divider,
    List,
    Toolbar,
    useTheme,
    styled,
    Drawer,
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
    createTheme,
    Box,
    Accordion: StyledAccordion,
    AccordionSummary,
    AccordionDetails,
} = MaterialUI;

const Plot = createPlotlyComponent(Plotly);

/**========================================================================================================*/

/**
 *
 * Icons
 */
const MenuIcon = () => {
    return (
        // <span className="material-icons">face</span>
        <span className="material-icons">menu</span>
    );
}

const AccordionIcon = ({id, handleClick}) => {
    return (
        <Box id={id} component="span" className="material-icons" sx={{}} onClick={handleClick}>
          expand_more
        </Box>
    );
}

const ChevronLeftIcon = () => {
    return (<span className="material-icons">arrow_back</span>);
}

const SettingsIcon = () => {
    return (<span className="material-icons">settings</span>);
}

const SearchIcon = () => {
    return (<span className="material-icons">search</span>);
}

const CloseIcon = () => {
    return (<span className="material-icons">close</span>);
}

const RefreshIcon = () => {
    return (<span className="material-icons">refresh</span>);
}

const ResetIcon = () => {
    return (<span className="material-icons">settings_backup_restore</span>
);
}

const GithubIcon = () => {
    return (
        <img width={16} height={16} src="./css/githubIcon.svg"/>
    );
}

/**========================================================================================================*/

/**
 * Styled
 */

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            // main: '#556cd6',
            main: '#FF9800',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: colors.red.A400,
        },
    },
});

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('sm')]: {
        //     width: '12ch',
        //     '&:focus': {
        //         width: '20ch',
        //     },
        // },
    },
}));

const StyledAccordionSummary = styled((props) => (
    <AccordionSummary
        // expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }}
        // />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    // 'rgba(255, 152, 0, 0.2)'
    // backgroundColor: alpha(theme.palette.primary, 0.15),
        // theme.palette.mode === 'dark'
        //     ? 'rgba(255, 255, 255, .05)'
        //     : 'rgba(0, 0, 0, .03)',
    // flexDirection: 'row-reverse',
    // '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    //     transform: 'rotate(90deg)',
    // },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));


const Main = styled('main', { shouldForwardProp: (prop) => !["openRuns", "openSettings", "runsDrawerWidth", "settingsDrawerWidth"].includes(prop)})(
    ({ theme, openRuns, openSettings, runsDrawerWidth, settingsDrawerWidth }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${runsDrawerWidth}px`,
        marginRight: `-${settingsDrawerWidth}px`,
        ...(openRuns && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
        ...(openSettings && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
    }),
);

const TopBar = styled(AppBar, {shouldForwardProp: (prop) => !["openRuns", "openSettings", "runsDrawerWidth", "settingsDrawerWidth"].includes(prop)})(
    ({ theme, openRuns, openSettings, runsDrawerWidth, settingsDrawerWidth }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(openRuns && {
            width: `calc(100% - ${runsDrawerWidth}px)`,
            marginLeft: `${runsDrawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(openSettings && {
            width: `calc(100% - ${settingsDrawerWidth}px)`,
            marginRight: `${settingsDrawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(openSettings && openRuns && {
            width: `calc(100% - ${settingsDrawerWidth + runsDrawerWidth}px)`,
            marginRight: `${settingsDrawerWidth}px`,
            marginLeft: `${runsDrawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const RunsDragger = styled('div')(({ theme }) => ({
    width: "7px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#f4f7f9"
    // backgroundColor: "#FF9800"
}));

const SettingsDragger = styled(Box)(({ theme }) => ({
    width: "7px",
    height: "100%",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#f4f7f9"
}));

/**
 *
 * Components
 */

const BooleanConfig = ({chain, value, description, config, setConfig}) => {

    const [checked, setChecked] = React.useState(value)

    const handleChange = (event) => {
        let newConfig = {...config}
        modifyObject(newConfig, chain, event.target.checked, 0)
        setConfig(newConfig);
        setChecked(event.target.checked);
    }
    return (
        <ListItem>
            <Tooltip title={description}>
                <ListItemText id="switch-list-label-bluetooth" primary={chain[chain.length - 1]} />
            </Tooltip>
            <Switch
                edge="end"
                onChange={handleChange}
                checked={checked}
                // defaultChecked={value}
            />


        </ListItem>
    );
}

const EnumeratedConfig = ({chain, name, value, values, description,config, setConfig}) => {

    const [val, setVal] = React.useState(value? value: values[0])

    const handleChange = (event) => {
        let newConfig = {...config}
        if (event.target.value === "true") {
            modifyObject(newConfig, chain, true)
            // newConfig[name] = true;
        }
        if (event.target.value === "false") {
            modifyObject(newConfig, chain, true)
        }
        // newConfig[name] = false;
        else {
            modifyObject(newConfig, chain,  event.target.value)
            // newConfig[name] = event.target.value;
        }
        setConfig(newConfig);
        setVal(event.target.value);
    }

    return (
        <ListItem>
            <FormControl sx={{ width: '100%' }}>
                <Tooltip title={description}>
                    <InputLabel id={`${name}`}>{chain[chain.length - 1]}</InputLabel>
                </Tooltip>

                <Select
                    labelId={`${name}`}
                    id={`select-${name}`}
                    value={val}
                    // defaultValue={value? value: values[0]}
                    onChange={handleChange}
                    // autoWidth
                    label={chain[chain.length - 1]}
                >
                    {values.map((v) => {
                        return (<MenuItem key={v} value={`${v}`}>{`${v}`}</MenuItem>)
                    })}

                </Select>
            </FormControl>
        </ListItem>
    );
}

const NumberConfig = ({chain, value, min, max, description, config, setConfig}) => {


    const handleKeyDown = (event) => {
        if(event.keyCode == 13){ // enter
            let newConfig = {...config}
            let v = parseFloat(event.target.value);
            if (v < min || v > max)
                alert(`value must be between ${min} and ${max}`)
            else {
                modifyObject(newConfig, chain, v, 0)
            }
            setConfig(newConfig);
        }
    }


    return (
        <ListItem>
            <FormControl sx={{ width: '100%' }}>
                <Tooltip title={description}>
                    <TextField
                        label={chain[chain.length - 1]}
                        fullWidth
                        type="number"
                        min={min}
                        max={max}
                        defaultValue={value}
                        onKeyDown={handleKeyDown}
                    />
                </Tooltip>


            </FormControl>
        </ListItem>
    );
}

const StringConfig = ({chain, name, value, description, config, setConfig}) => {

    // const [checked, setChecked] = React.useState(value)


    const handleKeyDown = (event) => {
        if(event.keyCode == 13){ // enter
            let newConfig = {...config}
            modifyObject(newConfig, chain, event.target.value, 0)
            setConfig(newConfig);
        }
    }

    return (
        <ListItem>
            <FormControl sx={{ width: '100%' }}>
                <Tooltip title={description}>
                    <TextField
                        label={chain[chain.length - 1]}
                        fullWidth
                        defaultValue={value}
                        // onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </Tooltip>
            </FormControl>
        </ListItem>
    );
}

const CustomConfig = ({chain, name, value, description, config, setConfig}) => {

    // const [checked, setChecked] = React.useState(value)


    const handleKeyDown = (event) => {
        if(event.keyCode == 13){ // enter
            try {
                let newConfig = {...config}
                let json = JSON.parse(event.target.value);
                modifyObject(newConfig, chain, json, 0)
                newConfig = mergeDeep(config, json)
                // modifyObject(newConfig, chain, event.target.value, 0)
                setConfig(newConfig);
            } catch (error) {
                alert(error);
              return;
            }

        }
    }

    return (
        <ListItem>
            <FormControl sx={{ width: '100%' }}>
                <Tooltip title={description}>
                    <TextField
                        label={chain[chain.length - 1]}
                        fullWidth
                        defaultValue={JSON.stringify(value)}
                        multiline
                        maxRows={4}
                        // onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </Tooltip>
            </FormControl>
        </ListItem>
    );
}

const ConfigComponent = ({attributeName, attributeValue, config, setConfig}) => {

    const chain = attributeName.split(PARENT_DELIMITER).filter(r => r !== '');
    // const [val, setVal] = React.useState(attributeValue.dflt)
    let val = attributeValue.dflt
    if(!(config
        && Object.keys(config).length === 0
        && Object.getPrototypeOf(config) === Object.prototype)){
        val = getValue(config, chain);
    }
    //
    // // React.useEffect(()=>{
    // //     let v = getValue(config, chain)
    // //     if(v){
    // //         setVal(v)
    // //     }
    // // }, [config])

    switch (attributeValue.valType) {
        case 'boolean':
            return (<BooleanConfig chain={chain} value={val} description={attributeValue.description} config={config} setConfig={setConfig}/>);
        case 'enumerated':
            return (<EnumeratedConfig chain={chain} value={val} values={attributeValue.values} description={attributeValue.description} config={config} setConfig={setConfig}/>);
        case 'number':
            return (<NumberConfig chain={chain} value={val} min={attributeValue.min} max={attributeValue.max} description={attributeValue.description} config={config} setConfig={setConfig} />);
        case 'string':
            return (<StringConfig chain={chain} value={val} description={attributeValue.description} config={config} setConfig={setConfig} />);
        case 'custom':
            return (<CustomConfig chain={chain} value={val} description={attributeValue.description} config={config} setConfig={setConfig} />);

        default:
            return (<div/>);
    }
}

const PlotConfigs = ({parent, attributes, plotConfig, setPlotConfig}) => {

    return (
        <List dense={true}
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >

            {
                Object.keys(attributes).map((el) => {
                    if(attributes[el].hasOwnProperty('valType')) {
                        return(
                            <ConfigComponent key={parent === '' ? el :`${parent}${PARENT_DELIMITER}${el}`} attributeName={parent === '' ? el :`${parent}${PARENT_DELIMITER}${el}`} attributeValue={attributes[el]} config={plotConfig} setConfig={setPlotConfig}/>
                        );
                    }
                    else {
                        let parentObjName = `${el}`;
                        return (
                            <StyledAccordion key={`${parentObjName}.${el}`}>
                                <StyledAccordionSummary
                                    expandIcon={<AccordionIcon />}
                                    id={`Accordion-${parentObjName}`}
                                >
                                    <Typography>{parentObjName}</Typography>
                                </StyledAccordionSummary>
                                <AccordionDetails>
                                    <PlotConfigs key={parent === '' ? parentObjName :`${parent}${PARENT_DELIMITER}${parentObjName}`} parent={parent === '' ? parentObjName :`${parent}${PARENT_DELIMITER}${parentObjName}`} attributes={attributes[el]} plotConfig={plotConfig} setPlotConfig={setPlotConfig} />
                                </AccordionDetails>
                            </StyledAccordion>
                        );
                    }

                    // ConfigComponent(configAttributes[key].valType, key, configAttributes[key].dflt, plotConfig, setPlotConfig)
                })
                // getConfigComponent(configAttributes['staticPlot'].valType, 'staticPlot', configAttributes['staticPlot'].dflt, plotConfig, setPlotConfig)
            }
        </List>
    );
}

const LayoutConfigs = ({parent, attributes, layoutConfig, setLayoutConfig}) => {

    return (
        <List dense={true}
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >

            {
                Object.keys(attributes).map((el) => {
                    if(attributes[el].hasOwnProperty('valType')) {
                        return(
                            <ConfigComponent key={parent === '' ? el :`${parent}${PARENT_DELIMITER}${el}`} attributeName={parent === '' ? el :`${parent}${PARENT_DELIMITER}${el}`} attributeValue={attributes[el]} config={layoutConfig} setConfig={setLayoutConfig}/>
                        );
                    }
                    else {
                        let parentObjName = parent === '' ? el :`${parent}${PARENT_DELIMITER}${el}`;
                        return (
                            <StyledAccordion key={`${parentObjName}.${el}`}>
                                <StyledAccordionSummary
                                    expandIcon={<AccordionIcon />}
                                    id={`Accordion-${parentObjName}`}
                                >
                                    <Typography>{parentObjName}</Typography>
                                </StyledAccordionSummary>
                                <AccordionDetails>
                                    <LayoutConfigs  parent={parentObjName} attributes={attributes[el]} layoutConfig={layoutConfig} setLayoutConfig={setLayoutConfig} />
                                </AccordionDetails>
                            </StyledAccordion>

                        );
                    }

                })
            }
        </List>
    );
}

const Footer = () => {
    return (
        <Toolbar>
            <Box sx={{flexGrow:1}}  align={'center'}>
                <Typography variant="body2" color="text.secondary" align="center">
                        Feedback/issues ? <br/> Check the plugin's repository on
                        <IconButton edge={'end'} onClick={() => {
                            window.open(github_url, "_blank");
                        }} >
                            <GithubIcon/>
                        </IconButton>
                </Typography>
            </Box>
        </Toolbar>
    );
}

const Runs = ({setIsLoading, checked, setChecked, filterSearchInput, runsConfig, setRunsConfig, runs, deactivatedRuns, setDeactivatedRuns}) => {
    // const [checked, setChecked] = React.useState({});
    const [expanded, setExpanded] = React.useState(false);
    const [clickedAccordion, setClickedAccordion] = React.useState('');
    const handleAccordionIconClick = (event) => {
        setClickedAccordion(event.currentTarget.id);
        setExpanded(!expanded);
    }


    const handleToggle = (value) => () => {
        setIsLoading(true);
        let newChecked = {...checked}
        newChecked[value] = !newChecked[value];
        setChecked(newChecked);
    };


    const handleChange = (event) => {
        let d_runs = [...deactivatedRuns];
        if(!event.target.checked){
            d_runs.push(event.target.id);
        }
        else{
            d_runs = deactivatedRuns.filter(e => e !== event.target.id);
        }

        setDeactivatedRuns(d_runs);
    }

    let filtered = [];
    if(filterSearchInput){
        filtered = runs.filter((e) => {return e.toLowerCase().includes(filterSearchInput.toLowerCase())})
    }
    else {
        filtered = runs;
    }

    return (
        <div>
            {/*// <List dense={true} sx={{ width: '100%', bgcolor: 'background.paper' }}>*/}
            {filtered.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                    <StyledAccordion key={value} expanded={expanded && clickedAccordion === value}>
                        <StyledAccordionSummary
                            sx={{margin: '0px'}}
                            expandIcon={<AccordionIcon
                                id={value}
                                style={{ cursor: 'pointer' }}
                                handleClick={handleAccordionIconClick}
                            />}
                            id={`Accordion-${value}`}
                        >
                            <ListItemButton disableGutters role={undefined} onClick={handleToggle(value)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        // checked={checked.indexOf(value) !== -1}
                                        checked={checked[value] === true}
                                        tabIndex={-1}
                                        disableRipple
                                        // defaultChecked
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        id={value}
                                        onChange={handleChange}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value} />
                            </ListItemButton>
                        </StyledAccordionSummary>
                        <AccordionDetails>
                            <PlotConfigs parent={value} attributes={tracesAttributes} plotConfig={runsConfig} setPlotConfig={setRunsConfig}/>
                        </AccordionDetails>
                    </StyledAccordion>
                );
            })}
            {/*</List>*/}
        </div>
    );
}

function TagPlot({isLoading, layoutConfig, plotConfig, data, title, revision}) {

    return(
        <div>
            {isLoading?
                <Box sx={{ display: 'flex',  justifyContent: 'center' }}>
                    <CircularProgress disableShrink />
                    {/*<LinearProgress />*/}
                </Box>
                :
                <Plot
                    data={data}
                    layout={ {
                        ...layoutConfig,
                        title: {...layoutConfig.title, text: title},
                    }}
                    revision={revision}
                    config={plotConfig}
                />}
        </div>

    );
}

function TagAccordion({tag, plot, expanded}) {
    return (
        <StyledAccordion defaultExpanded={expanded}>
            <StyledAccordionSummary
                expandIcon={<AccordionIcon />}
                id={`Accordion-${tag}`}
            >
                <Typography>{tag}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
                {plot}
            </AccordionDetails>
        </StyledAccordion>
    );
}

/**========================================================================================================*/

/**
 *
 * Containers
 */

const SettingsDrawer = ({generalConfig, setGeneralConfig, layoutConfig, setLayoutConfig, plotConfig, setPlotConfig, openSettings, handleSettingsDrawerClose, settingsDrawerWidth, setSettingsDrawerWidth}) => {

    const handleMouseDown = (e) => {
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseMove = React.useCallback((e) => {
        const newWidth = -(e.clientX - document.body.offsetWidth);
        if (newWidth > minSettingsDrawerWidth && newWidth < maxSettingsDrawerWidth) {
            setSettingsDrawerWidth(newWidth);
        }
    }, []);


    const [child, setChild] = React.useState(null);

    // TODO: Wanted to fix the height of the dragger but I couldn't yet :(
    // const ref = React.useRef(null);
    // React.useEffect(() => {
    //     if(ref.current === null)
    //         return
    //     // setWidth(ref.current.offsetWidth);
    //     setChild(ref.current.children[0])
    // }, [ref, child]);


    return (
        <Drawer
            // ref={ref}
            sx={{
                width: settingsDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: settingsDrawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="right"
            open={openSettings}
        >
            <SettingsDragger onMouseDown={(e) => handleMouseDown(e)}/>
            <DrawerHeader sx={{justifyContent: 'space-between'}}>
                <Typography variant='h6' sx={{ marginLeft: '7px', flexGrow:1}}>Settings</Typography>
                <Box  sx={{display:'flex', justifyContent: 'end'}}>
                    <Tooltip title={'Reset all settings to defaults'}>
                    <IconButton onClick={() => {resetSettings()}}>
                        <ResetIcon/>
                    </IconButton>
                    </Tooltip>
                    <IconButton onClick={handleSettingsDrawerClose}>
                        <CloseIcon/>
                    </IconButton>

                </Box>

            </DrawerHeader>
            <Divider />
            <Box sx={{height:'inherit', display: 'flex', flexDirection:'column', justifyContent: 'space-between'}}>
                <Box sx={{flexGrow: 1}}>
                    <StyledAccordion>
                        <StyledAccordionSummary
                            expandIcon={<AccordionIcon />}
                            id={`Accordion-plotConfig`}
                        >
                            <Typography variant={'h7'}>General Settings</Typography>
                        </StyledAccordionSummary>
                        <AccordionDetails>
                            <PlotConfigs parent={''} attributes={generalConfigAttributes} plotConfig={generalConfig} setPlotConfig={setGeneralConfig}/>
                        </AccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <StyledAccordionSummary
                            expandIcon={<AccordionIcon />}
                            id={`Accordion-plotConfig`}
                        >
                            <Typography>Plot Settings</Typography>
                            {/*<IconButton*/}
                            {/*    color="inherit"*/}
                            {/*    aria-label="open drawer"*/}
                            {/*    edge="end"*/}
                            {/*    onClick={() => {*/}
                            {/*       console.log('upload json');*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <RefreshIcon />*/}
                            {/*</IconButton>*/}
                        </StyledAccordionSummary>
                        <AccordionDetails>
                            <PlotConfigs parent={''} attributes={configAttributes} plotConfig={plotConfig} setPlotConfig={setPlotConfig}/>
                        </AccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <StyledAccordionSummary
                            expandIcon={<AccordionIcon />}
                            id={`Accordion-layoutConfig`}
                        >
                            <Typography>Layout Settings</Typography>
                        </StyledAccordionSummary>
                        <AccordionDetails>
                            <PlotConfigs parent={''} attributes={layoutAttributes} plotConfig={layoutConfig} setPlotConfig={setLayoutConfig}/>
                        </AccordionDetails>
                    </StyledAccordion>
                </Box>
                <Box>
                   <Footer/>
                </Box>

            </Box>

        </Drawer>
    );
}

const RunsDrawer = ({setIsLoading, runsConfig, setRunsConfig, open, handleRunsDrawerClose, runs, deactivatedRuns, setDeactivatedRuns, runsDrawerWidth, setRunsDrawerWidth}) => {

    const [filterSearchInput, setFilterSearchInput] = React.useState();
    const [checked, setChecked] = React.useState({});
    const [filterCheck, setFilterCheck] = React.useState(true);

    // React.useEffect(()=> {
    //     //init
    //     let dr = runs.filter((run) => {return !checked[run]})
    //     let newdr = [...deactivatedRuns, ...dr];
    //     setDeactivatedRuns(newdr);
    // },[setChecked])
    // TODO: remove deactivated runs and replace them with the checked object
    React.useEffect(()=>{
        // filtered
        let dr = runs.filter((run) => {return !checked[run]})
        setDeactivatedRuns(dr);

        // toggle check button if all are false
        let checkedArr = Object.values(checked);
        if(checkedArr.length > 0 && checkedArr.every(v => v === false)){
            setFilterCheck(false);
        }
    },[checked])

    React.useEffect(() => {
        let chk = {}
        for(const run of runs){
            chk[run] = deactivatedRuns.includes(run)? false: true;
        }
        setChecked(chk);
    },[runs])

    const handleMouseDown = (e) => {
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("mousemove", handleMouseMove, true);
    };


    const handleMouseMove = React.useCallback((e) => {
        const newWidth = e.clientX - document.body.offsetLeft;
        if (newWidth > minRunsDrawerWidth && newWidth < maxRunsDrawerWidth) {
            setRunsDrawerWidth(newWidth);
        }
    }, []);

    const handleKeyDown = (event) => {
        if(event.keyCode == 13){ // enter
            let v = event.target.value;
            setFilterSearchInput(v);
        }
    }

    const handleChange = (event) => {
        let newChecked = {...checked};
        for(let run in newChecked){
            newChecked[run] = event.target.checked
        }
        setChecked(newChecked);
        setFilterCheck(event.target.checked);
    }

    return (
        <Drawer
            sx={{
                width: runsDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: runsDrawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <RunsDragger onMouseDown={(e) => handleMouseDown(e)}/>
            <DrawerHeader>
                {/*Header*/}
                <Checkbox
                    edge="start"
                    checked={filterCheck}
                    tabIndex={-1}
                    disableRipple
                    // defaultChecked
                    onChange={handleChange}
                    // inputProps={{ 'aria-labelledby': labelId }}
                    // id={value}
                    // onChange={handleChange}
                />

                <Search sx={{ flexGrow: 1, width: '50%' }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        sx={{ flexGrow: 1, width: '100%' }}
                        placeholder="Filter runs ..."
                        inputProps={{ 'aria-label': 'filter tags' }}
                        // onChange={handleFilterChange}
                        onKeyDown={handleKeyDown}
                    >
                    </StyledInputBase>
                </Search>

                <IconButton onClick={handleRunsDrawerClose}>
                    <ChevronLeftIcon/>
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Runs setIsLoading={setIsLoading} checked={checked} setChecked={setChecked} filterSearchInput={filterSearchInput} runsConfig={runsConfig} setRunsConfig={setRunsConfig} runs={runs} deactivatedRuns={deactivatedRuns} setDeactivatedRuns={setDeactivatedRuns}/>
        </Drawer>
    );
}

function TagsAccordion({isLoading, toImageConfig,layoutConfig, plotConfig, tags, data, revision, filterSearchInput}) {

    let filtered = [];
    if(filterSearchInput){
        filtered = tags.filter((e) => {return e.toLowerCase().includes(filterSearchInput.toLowerCase())})
    }
    else {
        filtered = tags;
    }
    const accordions = filtered.map((tag, index) => {
        const plot = <TagPlot isLoading={isLoading} layoutConfig={layoutConfig} toImageConfig={toImageConfig} plotConfig={plotConfig} title={tag} data={data[tag]} revision={revision}/> ;
        // const plot = <div/> ;
        const acc = <TagAccordion key={`Accordion-${tag}`} tag={tag} plot={plot}
                                  // expanded={index === 0}
        />
        return(acc);
    })

    return (
        <div>
            {accordions}
        </div>
    );
}

function Dashboard({isLoading, setIsLoading, manualLoading, setManualLoading, generalConfig, setGeneralConfig, runsConfig, setRunsConfig, layoutConfig, setLayoutConfig, toImageConfig, setToImageConfig, plotConfig, setPlotConfig, settings, setSettings, tags, runs, data, revision,  deactivatedRuns, setDeactivatedRuns}) {

    const theme = useTheme();
    const [openRuns, setOpenRuns] = React.useState(true);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [runsDrawerWidth, setRunsDrawerWidth] = React.useState(defaultRunsDrawerWidth);
    const [settingsDrawerWidth, setSettingsDrawerWidth] = React.useState(defaultSettingsDrawerWidth);
    const [filterSearchInput, setFilterSearchInput] = React.useState();

    const handleRunsDrawerOpen = () => {
        setOpenRuns(true);
    };

    const handleRunsDrawerClose = () => {
        setOpenRuns(false);
    };

    const handleSettingsDrawerOpen = () => {
        setOpenSettings(true);
    };

    const handleSettingsDrawerClose = () => {
        setOpenSettings(false);
    };

    const handleKeyDown = (event) => {
        if(event.keyCode == 13){ // enter
            let v = event.target.value;
            setFilterSearchInput(v);
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopBar position="fixed" openRuns={openRuns} openSettings={openSettings} runsDrawerWidth={runsDrawerWidth} settingsDrawerWidth={settingsDrawerWidth}
                // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, }}
                sx={{ height: '50px'}}
            >
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleRunsDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(openRuns && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Search sx={{ flexGrow: 1, width: '50%' }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            sx={{ flexGrow: 1, width: '100%' }}
                            placeholder="Filter Tags ..."
                            inputProps={{ 'aria-label': 'filter tags' }}
                            // onChange={handleFilterChange}
                            onKeyDown={handleKeyDown}
                        >

                        </StyledInputBase>

                    </Search>

                    {/*<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>*/}
                    {/*    Persistent drawer*/}
                    {/*</Typography>*/}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={() => {
                            setManualLoading(manualLoading + 1)
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleSettingsDrawerOpen}
                        sx={{ ...(openSettings && { display: 'none' }) }}
                    >
                        <SettingsIcon />
                    </IconButton>

                </Toolbar>
            </TopBar>
            <RunsDrawer setIsLoading={setIsLoading} runsConfig={runsConfig} setRunsConfig={setRunsConfig} setRunsDrawerWidth={setRunsDrawerWidth} open={openRuns} handleRunsDrawerClose={handleRunsDrawerClose} runs={runs} deactivatedRuns={deactivatedRuns} setDeactivatedRuns={setDeactivatedRuns} runsDrawerWidth={runsDrawerWidth}/>
            <Main openRuns={openRuns} openSettings={openSettings} runsDrawerWidth={runsDrawerWidth} settingsDrawerWidth={settingsDrawerWidth}>
                <DrawerHeader />
                <TagsAccordion isLoading={isLoading} layoutConfig={layoutConfig} toImageConfig={toImageConfig} plotConfig={plotConfig} tags={tags} data={data} revision={revision} filterSearchInput={filterSearchInput}/>
            </Main>
            <SettingsDrawer generalConfig={generalConfig} setGeneralConfig={setGeneralConfig} layoutConfig={layoutConfig} setLayoutConfig={setLayoutConfig} toImageConfig={toImageConfig} setToImageConfig={setToImageConfig} plotConfig={plotConfig} setPlotConfig={setPlotConfig} settings={settings} setSettings={setSettings} openSettings={openSettings} settingsDrawerWidth={settingsDrawerWidth} handleSettingsDrawerClose={handleSettingsDrawerClose} setSettingsDrawerWidth={setSettingsDrawerWidth}/>
        </Box>
    );
}

/**========================================================================================================*/

/**
 * App Component
 */

function App() {

    const [rawData, setRawData] = React.useState({});
    const [data, setData] = React.useState([]);
    const [runsConfig, setRunsConfig] = React.useState(initRunsConfig)

    const [tags, setTags] = React.useState([]);
    const [runs, setRuns] = React.useState([]);
    const [deactivatedRuns, setDeactivatedRuns] = React.useState(Object.values(initDeactivatedRuns))
    const [revision, setRevision] = React.useState(0);
    const [manualLoading, setManualLoading] = React.useState(0)

    const [generalConfig, setGeneralConfig] = React.useState(initGeneralConfig);
    const [plotConfig, setPlotConfig] = React.useState(initPlotConfig);
    const [layoutConfig, setLayoutConfig] = React.useState(initLayoutConfig);

    const [isLoading, setIsLoading] = React.useState(false);

    const processData = () => {
        let d = {}
        for(const tag in rawData) {
            let traces = [];
            for(const run in rawData[tag]){
                if(deactivatedRuns.includes(run)){
                    continue
                }
                // let conf = JSON.parse(JSON.stringify(runsConfig[run]))
                let trace = {...rawData[tag][run], ...runsConfig[run]};
                // trace.line = {color: 'red'}
                traces.push(trace);
            }
            d[tag] = traces;
        }
        // time vs step
        if(generalConfig.horizontalAxis === 'Time'){
            // let newLc = {...layoutConfig, xaxis: {...layoutConfig.xaxis, type: 'date', tickformat: '%M:%S', hoverformat: '%H:%M:%S %d/%m/%y'}};
            let newLc = {...layoutConfig, xaxis: {...layoutConfig.xaxis, type: 'date'}};
            setLayoutConfig(newLc);
        }
        else{
            if(layoutConfig.xaxis.type === 'date'){
                let newLc = {...layoutConfig, xaxis: {...layoutConfig.xaxis, type: 'linear'}};
                setLayoutConfig(newLc);
            }

        }

        return d;
    }

    React.useEffect(()=> {
        getTags().then((tags) => {
            setTags(tags);
        })
    },[setTags])


    React.useEffect(()=> {
        getRuns().then((runs) => {
            setRuns(runs)
        })
    },[tags])


    React.useEffect(()=>{
        // initialize runs configs
        let rc = runs.length > 0 ? {}: null;
        for(const run of runs){
            if(runsConfig[run] === undefined){
                rc[run] = JSON.parse(JSON.stringify(dfltTracesConfig)); //:(  // if run is new initialize it with dflt
            }
            else{
                rc[run] = {...runsConfig[run]};
            }
        }
        if(rc === null){
            return;
        }
        setRunsConfig(rc);
    },[runs])

    useInterval(()=>{
        setManualLoading(manualLoading + 1);
    },generalConfig.autoReload? generalConfig.autoReloadInterval: null)


    React.useEffect(()=>{
        getData(generalConfig.horizontalAxis).then((res) => {
            setIsLoading(true);
            setRawData(res);
        })
    },[manualLoading, generalConfig.horizontalAxis])

    React.useEffect(() => {
        setIsLoading(true);
        let processedData = processData();
        setData(processedData);
        localStorage.setItem('deactivatedRuns', JSON.stringify(deactivatedRuns));
    },[rawData, runsConfig, deactivatedRuns])

    React.useEffect(()=> {
        setRevision(revision + 1);
        // save config to localStorage for reuse
        localStorage.setItem('plotConfig', JSON.stringify(plotConfig));
        localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
        localStorage.setItem('generalConfig', JSON.stringify(generalConfig));
        localStorage.setItem('runsConfig', JSON.stringify(runsConfig));
        setIsLoading(false);
    },[data, plotConfig, layoutConfig, generalConfig, runsConfig])

    return (
         <Dashboard isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    manualLoading={manualLoading}
                    setManualLoading={setManualLoading}
                    generalConfig={generalConfig}
                    setGeneralConfig={setGeneralConfig}
                    runsConfig={runsConfig}
                    setRunsConfig={setRunsConfig}
                    layoutConfig={layoutConfig}
                    setLayoutConfig={setLayoutConfig}
                    plotConfig={plotConfig}
                    setPlotConfig={setPlotConfig}
                    tags={tags}
                    runs={runs}
                    data={data}
                    revision={revision}
                    deactivatedRuns={deactivatedRuns}
                    setDeactivatedRuns={setDeactivatedRuns} />
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>,
);
