import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import jwt_decode from "jwt-decode"

import { userLogin } from '../store/auth/actions'
import { sendRequest } from '../wrappers/apiWrappers'


export default function Signup() {

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isErrorOnRegister, setIsErrorOnRegister] = useState(false);
    const dispatch = useDispatch();
    const {token} = useSelector(state => state.auth)

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        // validate form data and then validate user
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
        else{
            event.preventDefault();
            const response = await sendRequest(
                `user/register/`,
                'post',
                token,
                { username, password, email }
                );
            // redirect to dashboard if valid user else show error message
            if(response.access){
                dispatch(userLogin({
                    access: response.access,
                    user: jwt_decode(response.access).user,
                    firstname: jwt_decode(response.access).firstname,
                    lastname: jwt_decode(response.access).lastname,
                    email: jwt_decode(response.access).email,
                }))
                history.push("/");
            }
            else{
                setIsErrorOnRegister(true);
            }
        }
    }

    useEffect(() => {
        // redirect to dashboard if alreday logged in
        if(token){
            history.push('/')
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Container fluid>
            <Row className='align-items-center justify-content-center pt-5'>
                <Col xs={11} sm={8} md={6} lg={4} xl={3} className='p-4 mt-5'>
                    <h2 className='text-center mb-5'>Signup</h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value.trim())}
                            />
                            <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value.trim())}
                            />
                            <Form.Control.Feedback  type='invalid'>Invalid email!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value.trim())}
                            />
                            <Form.Control.Feedback  type='invalid'>Password is required!</Form.Control.Feedback>
                        </Form.Group>
                        {
                            isErrorOnRegister && 
                            <div className='text-danger'>Username or email already exists!</div>
                        }
                        <Button variant="success" className='w-100 mt-4' type="submit">Signup</Button>
                    </Form>
                    <div className='text-center mt-4'>Already have an account? Login <Link to='/login'>here</Link></div>
                </Col>
            </Row>
        </Container>
    )
}
