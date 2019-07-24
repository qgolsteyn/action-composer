# Action composer

This repo tries to answer the question: What if we could organize actions into sequences
in real-time?

It is important to define some nomenclature. The two important terms are that of state
and actions. We define state as the current set of properties used to describe an application
as a particular point of time. We define actions as a mutation on the state.

In a Redux web app, we consider the state to be immutable. To change it, one must dispatch
an action which will create a new copy of the state. In some ways, we can say that
the state is an accumulation of actions. It is from this perspective that we can identify
some interesting properties.

This repo is a work in progress, currently set on exploring the possibilities
that viewing state as an accumulation of actions provide.