import * as React from 'react';

export default class TabbedHeader extends React.Component<{}, {}> {
    renderTabs() {
        return (
            <div className="tab-group">
                <div className="for-inset">
                </div>
                <div className="tab-item">
                    <span className="icon icon-cancel icon-close-tab"></span>
                    #1
                </div>
                <div className="tab-item active">
                    <span className="icon icon-cancel icon-close-tab"></span>
                    #2
                </div>
                <div className="tab-item">
                    <span className="icon icon-cancel icon-close-tab"></span>
                    #3
                </div>
                <div className="tab-item tab-item-fixed">
                    <span className="icon icon-plus"></span>
                </div>
            </div>
        );
    }

    render() {
        // Note: 80px for inset buttons on OS X
        const header_style = {
            height: '30px',
            paddingLeft: '80px',
        };

        return (
            <header className="toolbar toolbar-header" style={header_style}>
                {this.renderTabs()}
            </header>
        );
    }
}
