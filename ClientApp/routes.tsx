import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { News } from './components/News';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Resources } from './components/Resources';

export const routes = <Layout>
    <Route path='/news' component={News} />
    <Route exact path='/' component={ News } />
    <Route path='/contact' component={ Contact } />
    <Route path='/about' component={About} />
    <Route path='/resources' component={Resources} />
</Layout>;
