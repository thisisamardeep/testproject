import React from 'react';
import {EmployeeName} from "../types/types";

//We need to call c from javascript
const IMPERATIVE_API = [
    'focus',
    'select',

];

type MyProps = {
    value: EmployeeName,
    inputProps: any,
    items: Array<{ key: string, name: string }>,
    onSelect: (value: any) => void,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

type MyState = {
    isOpen: boolean,
    highlightedIndex: number | null
}


export class AutoComplete extends React.Component<MyProps, MyState> {
    private _ignoreBlur: boolean;
    private _ignoreFocus: boolean;
    private notifRef: React.RefObject<any>;

    constructor(props: MyProps) {
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

    componentWillReceiveProps(nextProps: MyProps, nextContext: React.Context<any>) {
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

    handleKeyDown(event: any) {

        if (AutoComplete.keyDownHandlers.hasOwnProperty(event.key)) {
            (AutoComplete.keyDownHandlers as any)[event.key].call(this, event);

        } else if (!(this.isOpen())) {
            this.setState({
                isOpen: true
            })
        }
    }


    handleInputBlur() {
        if (this._ignoreBlur) {
            this._ignoreFocus = true;
            this.notifRef.current.input.focus();
            return;
        }
        this.setState({
            isOpen: false,
            highlightedIndex: null
        });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(event)

    }

    componentWillMount() {
        (this.notifRef as any).current = {};
    }


    static keyDownHandlers: {
        ArrowDown: (event: any) => void;
        ArrowUp: (event: any) => void;
        Enter: (event: any) => void;
        Escape: (event: any) => void;
        Tab: (event: any) => void;

    } = {
        ArrowDown(event: any) {
            event.preventDefault();
            let that = this as any;
            const items = that.getFilteredItems(that.props);
            if (items.length === 0) {
                return;
            }
            const {highlightedIndex} = that.state;
            let index = highlightedIndex === null ? -1 : highlightedIndex

            let newhighlightedIndex;
            if (index + 1 === items.length) {
                newhighlightedIndex = 0;
            } else {
                newhighlightedIndex = index + 1;
            }
            if (newhighlightedIndex !== highlightedIndex) {
                that.setState({
                    highlightedIndex: newhighlightedIndex,
                    isOpen: true,
                })
            }


        },
        ArrowUp(event: React.SyntheticEvent<EventTarget>) {
            event.preventDefault();
            let that = this as any;


            const items = that.getFilteredItems(that.props);
            if (items.length === 0) {
                return;
            }
            const {highlightedIndex} = that.state;
            let index = highlightedIndex === null ? -1 : highlightedIndex;

            let newhighlightedIndex;
            if (index === 0) {
                newhighlightedIndex = items.length - 1;
            } else {
                newhighlightedIndex = index - 1;
            }
            if (newhighlightedIndex !== highlightedIndex) {
                that.setState({
                    highlightedIndex: newhighlightedIndex,
                    isOpen: true,
                })
            }


        },

        Enter(event: React.KeyboardEvent<EventTarget>) {
            if (event.key.toString() !== '13') {
                return;
            }
            let that = this as any;


            that.setIgnoreBlur(false)
            if (!that.isOpen()) {
                return;
            } else if (that.state.highlightedIndex == null) {
                that.setState({
                    isOpen: false
                }, () => {

                    that.notifRef.current.input.select()
                })
            } else {
                event.preventDefault();

                const item = that.getFilteredItems(that.props)[that.state.highlightedIndex];
                const value = item.name;
                that.setState({
                    isOpen: false,
                    highlightedIndex: null
                }, () => {
                    that.props.onSelect(value)
                })
            }
        },
        Escape() {
            let that = this as any;

            that.setIgnoreBlur(false);
            that.setState({
                highlightedIndex: null,
                isOpen: false
            })
        },
        Tab() {
            let that = this as any;

            that.setIgnoreBlur(false)
        },

    };

    composeEventHandlers(internal: any, external: any) {
        return external
            ? (e: any) => {
                internal(e);
                external(e)
            }
            : internal
    }

    isOpen() {
        return this.state.isOpen;
    }


    exposeAPI(el: React.Component<HTMLInputElement>) {
        this.notifRef.current.input = el;
        IMPERATIVE_API.forEach((value) => {
            if (el && (el as any)[value]) {
                (this as any)[value] = (el as any)[value].bind(el);
            }
        });

    }

    getFilteredItems(props: any): MyProps['items'] {
        let items: MyProps['items'] = props.items;
        items = items.filter((item: any) => {
            if (this.matchStateToTerm(item, props.value)) {
                return true;
            } else {
                return false;
            }
        }).filter((value: any, index: any) => {
            if (index < 10) {
                return true;
            } else {
                return false;
            }
        })

        return items;
    }


    matchStateToTerm(item: { key: string, name: string }, value: string) {
        return (
            item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        )
    }

    renderItem(item: { key: string, name: string }, isHighlighted: boolean): React.ReactElement<any> {

        return (
            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                 key={item.key}>{item.name}

            </div>
        )

    }

    highlightItemFromMouse(index: number) {
        this.setState({highlightedIndex: index})
    }

    setIgnoreBlur(ignore: boolean) {
        this._ignoreBlur = ignore;
    }

    selectItemFromMouse(item: { key: string, name: string }) {
        const value: string = item.name;
        this.setIgnoreBlur(false);

        this.setState({
            isOpen: false,
            highlightedIndex: null
        }, () => {
            this.props.onSelect(value)

        })
    }

    maybeAutoCompleteText(state: any, props: any) {
        const {highlightedIndex} = state;
        const {value} = props;
        let index = highlightedIndex === null ? 0 : highlightedIndex;
        let items: MyProps['items'] = this.getFilteredItems(props);

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
            (item: { key: string, name: string }, index: number) => {
                const element: React.ReactElement<any> = this.renderItem(item, this.state.highlightedIndex === index);

                return React.cloneElement(element, {
                    onMouseEnter: () => {
                        this.highlightItemFromMouse(index)
                    },
                    onClick: () => {
                        this.selectItemFromMouse(item)
                    },
                    ref: (e: React.Component<HTMLElement>) => {
                        this.notifRef.current[`item-${index}`] = e;
                    }
                })
            }
        );

        const menu = ((children) => (<div className="menu">
            {children}
        </div>))(items);

        return React.cloneElement(menu, {
            ref: (e: React.Component<HTMLElement>) => this.notifRef.current.menu = e,

            onMouseEnter: () => {
                this.setIgnoreBlur(true)
            },
            onMouseLeave: () => {
                this.setIgnoreBlur(false)

            },
        })

    }

    isInputFocused() {
        const el = this.notifRef.current.input;
        return el.ownerDocument && (el === el.ownerDocument.activeElement)
    }

    handleInputClick() {
        if (this.isInputFocused() && !this.isOpen())
            this.setState({isOpen: true})
    }

    render() {
        const {inputProps} = this.props;
        const open: boolean = this.isOpen();

        return (
            <div style={{
                display: 'block',
                width: '100%',
                maxWidth: '500px',
                height: '40px',
                padding: '0px 0px',
                fontSize: '16px'
            }}>
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
