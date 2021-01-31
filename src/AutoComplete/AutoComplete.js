import React from 'react';

//We need to call c from javascript
const IMPERATIVE_API = [
    'focus',
    'select',

];

export class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            highlightedIndex: null,
        };
        this.exposeAPI = this.exposeAPI.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
        this.maybeAutoCompleteText = this.maybeAutoCompleteText.bind(this);

        this._ignoreBlur = false;
        this._ignoreFocus = false;
        this.notifRef = React.createRef();

    }

    componentWillReceiveProps(nextProps, nextContext) {
        if ((this.props.value !== nextProps.value || this.state.highlightedIndex === null)) {
            this.setState(this.maybeAutoCompleteText)
        }
    }


    handleInputFocus() {
        if (this._ignoreFocus) {
            this._ignoreFocus = false;
            return;
        }
        this.setState({isOpen: true});

    }

    handleKeyDown(event) {
        if (AutoComplete.keyDownHandlers[event.key]) {
            AutoComplete.keyDownHandlers[event.key].call(this, event);
        } else if (!(this.isOpen())) {
            this.setState({
                isOpen: true
            })
        }
    }


    handleInputBlur() {
        if (this._ignoreBlur) {
            this._ignoreFocus = true
            this.notifRef.current.input.focus()
            return;
        }
        this.setState({
            isOpen: false,
            highlightedIndex: null
        }, () => {
        });
    }

    handleChange(event) {
        this.props.onChange(event, event.target.value)

    }

    componentWillMount() {
        this.notifRef.current = {};
    }


    static keyDownHandlers = {
        ArrowDown(event) {
            event.preventDefault();
            const items = this.getFilteredItems(this.props);
            if (items.length === 0) {
                return;
            }
            const {highlightedIndex} = this.state;
            let index = highlightedIndex === null ? -1 : highlightedIndex

            let newhighlightedIndex;
            if (index + 1 === items.length) {
                newhighlightedIndex = 0;
            } else {
                newhighlightedIndex = index + 1;
            }
            if (newhighlightedIndex !== highlightedIndex) {
                this.setState({
                    highlightedIndex: newhighlightedIndex,
                    isOpen: true,
                })
            }


        },
        ArrowUp(event) {
            event.preventDefault();
            const items = this.getFilteredItems(this.props);
            if (items.length === 0) {
                return;
            }
            const {highlightedIndex} = this.state;
            let index = highlightedIndex === null ? -1 : highlightedIndex;

            let newhighlightedIndex;
            if (index === 0) {
                newhighlightedIndex = items.length - 1;
            } else {
                newhighlightedIndex = index - 1;
            }
            if (newhighlightedIndex !== highlightedIndex) {
                this.setState({
                    highlightedIndex: newhighlightedIndex,
                    isOpen: true,
                })
            }


        },

        Enter(event) {
            if (event.keyCode !== 13) {
                return;
            }
            this.setIgnoreBlur(false)
            if (!this.isOpen()) {
                return;

            } else if (this.state.highlightedIndex == null) {
                this.setState({
                    isOpen: false
                }, () => {
                    this.notifRef.current.input.select()
                })
            } else {
                event.preventDefault();
                const item = this.getFilteredItems(this.props)[this.state.highlightedIndex]
                const value = item.name;
                this.setState({
                    isOpen: false,
                    highlightedIndex: null
                }, () => {
                    this.props.onSelect(value)
                })
            }
        },
        Escape() {
            this.setIgnoreBlur(false)
            this.setState({
                highlightedIndex: null,
                isOpen: false
            })
        },
        Tab() {
            this.setIgnoreBlur(false)
        },
    };

    composeEventHandlers(internal, external) {
        return external
            ? e => {
                internal(e);
                external(e)
            }
            : internal
    }

    isOpen() {
        return this.state.isOpen;
    }


    exposeAPI(el) {
        this.notifRef.current.input = el;
        IMPERATIVE_API.forEach((value) => {
            if (el && el[value]) {
                this[value] = el[value].bind(el);
            }
        });

    }

    getFilteredItems(props) {
        let items = props.items;
        items = items.filter((item) => {
            if (this.matchStateToTerm(item, props.value)) {
                return true;
            } else {
                return false;
            }
        }).filter((value, index) => {
            if (index < 10) {
                return true;
            } else {
                return false;
            }
        })

        return items;
    }


    matchStateToTerm(item, value) {
        return (
            item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        )
    }

    renderItem(item, isHighlighted) {

        return (
            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                 key={item.key}>{item.name}

            </div>
        )

    }

    highlightItemFromMouse(index) {
        this.setState({highlightedIndex: index})
    }

    setIgnoreBlur(ignore) {
        this._ignoreBlur = ignore;
    }

    selectItemFromMouse(item) {
        const value = item.name;
        this.setIgnoreBlur(false);

        this.setState({
            isOpen: false,
            highlightedIndex: null
        }, () => {
            this.props.onSelect(value)

        })
    }

    maybeAutoCompleteText(state, props) {
        const {highlightedIndex} = state;
        const {value} = props;
        let index = highlightedIndex === null ? 0 : highlightedIndex;
        let items = this.getFilteredItems(props);

        const matchedItem = items[index] && items[index];
        if (value !== '' && matchedItem) {
            const itemValue = matchedItem.name;
            const itemValueDoesMatch = itemValue.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            if (itemValueDoesMatch) {
                return {highlightedIndex: index}
            }
        }
        return {highlightedIndex: null}
    }

    renderMenu() {
        const items = this.getFilteredItems(this.props).map(
            (item, index) => {
                const element = this.renderItem(item, this.state.highlightedIndex === index);

                return React.cloneElement(element, {
                    onMouseEnter: () => {
                        this.highlightItemFromMouse(index)
                    },
                    onClick: () => {
                        this.selectItemFromMouse(item)
                    },
                    ref: (e) => {
                        this.notifRef.current[`item-${index}`] = e;
                    }
                })
            }
        );

        const menu = ((children) => (<div className="menu">
            {children}
        </div>))(items);

        return React.cloneElement(menu, {
            ref: e => this.notifRef.current.menu = e,

            onMouseEnter: () => {
                this.setIgnoreBlur(true)
            },
            onMouseLeave: () => {
                this.setIgnoreBlur(false)

            },
        })

    }

    isInputFocused() {
        const el = this.notifRef.current.input
        return el.ownerDocument && (el === el.ownerDocument.activeElement)
    }

    handleInputClick() {
        if (this.isInputFocused() && !this.isOpen())
            this.setState({isOpen: true})
    }

    render() {
        const {inputProps} = this.props
        const open = this.isOpen();

        return (
            <div style={{
                display: 'block',
                width: '100%',
                maxWidth: '500px',
                height: '40px',
                padding: '0px 0px',
                fontSize: '16px'
            }} >
                <input {...inputProps}
                       autoComplete={'off'}
                       ref={this.exposeAPI}
                       onFocus={this.handleInputFocus}
                       onBlur={this.handleInputBlur}
                       onChange={this.handleChange}
                       onKeyDown={this.composeEventHandlers(this.handleKeyDown, inputProps.onKeyDown)}
                       onClick={this.composeEventHandlers(this.handleInputClick, inputProps.onClick)}
                       value={this.props.value}
                       style={{
                           width: '100%',
                           maxWidth: '500px',
                           height: '100%',
                           border: '1px solid black',
                           fontSize: '16px'
                       }}

                />
                {open && this.renderMenu()}

            </div>
        );
    }


}
