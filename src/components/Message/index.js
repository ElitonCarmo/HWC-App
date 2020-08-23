import React, { Component } from 'react';
import { Row, Column } from '../RowColumn';
import { FaTimes } from 'react-icons/fa';
import { Span } from '../Labels';

class Message extends Component {

    state = {
        color: ''
    };

    setColor() {
        const { messageData } = this.props;

        let color = '';
        switch (messageData.type) {
            case 'error': color = "#dc3545;"; break;
            case 'success': color = "#28a745;"; break;
        }

        return color;
    }

    render() {

        const { messageData } = this.props;
        const color = this.setColor();

        return (
            <>
                {

                    messageData.showMessage ?
                        (
                            <Row
                                justifyContent="space-between"
                                border={`1px solid ${color}`}
                                margin="10px;"
                                boxShadow={`2px 4px #cecece`}
                                color={color}
                            >

                                <Column>
                                    <Span color={color} fontWeight={"bold"}>
                                        {
                                            messageData.message.split('\n').map((item, i) => {
                                                return <p key={i}>{item}</p>;
                                            })
                                        }
                                    </Span>
                                </Column>

                                <Column>
                                    <FaTimes title="Clique aqui para Fechar a Mensagem"
                                        color="#b0b0b0" size={20}
                                        onClick={() => this.props.onClickMessage(false)}
                                    />
                                </Column>

                            </Row>
                        ) :
                        (
                            ''
                        )
                }
            </>
        )

    }
}

export default Message;


