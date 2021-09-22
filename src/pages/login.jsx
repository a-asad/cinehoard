import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {

    const history = useHistory();
    
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

    const validateUser = async () => {
        const response = await fetch('http://localhost:8000/api/user/login/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
        return await response.json();
    }

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
            const response = await validateUser();
            // redirect to dashboard if valid user else show error message
            if(response.access){
                localStorage.setItem('token', response.access)
                history.push("/");
            }
            else{
                setIsInvalidCredentials(true);
            }
        }
    }

    useEffect(() => {
        // redirect to dashboard if alreday logged in
        if(localStorage.getItem('token')){
            history.push('/')
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Container fluid>
            <Row className='pt-5 justify-content-center'>
                <Col xs={11} sm={8} md={6} lg={4} xl={3} className='p-4 mt-5'>
                    <h2 className='text-center mb-5'>Login</h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <Form.Control.Feedback  type='invalid'>Password is required!</Form.Control.Feedback>
                        </Form.Group>
                        {
                            isInvalidCredentials && 
                            <div className='text-danger'>Invalid credentials!</div>
                        }
                        <Button variant="success" className='w-100 mt-4' type="submit">Login</Button>
                    </Form>
                    <div className='text-center mt-4'>Don't have an account? Signup <Link to='/signup'>here</Link></div>
                </Col>
            </Row>
        </Container>
    )
}