import React, { Component } from "react";
import { withRouter } from 'react-router'
import TopNav from '../nav/TopNav';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from '../login/Login';
import Register from '../login/Register';
import Regulate from '../regulate/Regulate'
import Coping from '../coping/Coping'
import Stats from '../stats/Stats'
import FindHelp from '../findhelp/FindHelp'
import Profile from '../profile/Profile'
import NewRegulate from '../regulate/NewRegulate'
import Entries from '../entries/Entries'
import { getUserFromLocalStorage, logout } from '../login/LoginHandler'
import API from "../db/API"


let greatArray;
const greatOpt = [];
const goodOpt = [];
const okayOpt = [];
const notSoGreatOpt = [];
const badOpt = [];



class Home extends Component {
    state = {
        user: getUserFromLocalStorage(),
        greatMoods: [],
        goodMoods: [],
        okayMoods: [],
        notSoGreatMoods: [],
        badMoods: [],
        moodOpts: [],
        allCopingMechs: [],
        greatCopingMechs: [],
        goodCopingMechs: [],
        okayCopingMechs: [],
        notSoGreatCopingMechs: [],
        badCopingMechs: [],
        addModal: false,
        editModal: false,
        copingLabel: "Select a mood category for this coping mechanism",
        title: "",
        url: "",
        info: "",
        info2: "",
        copingMoodCategoryId: ""
    }

    //ComponentDidMount - for when you want something to happen as soon as the DOM is rendered, and not before.
    componentDidMount() {
        const newState = {
            user: getUserFromLocalStorage(),
            greatMoods: [],
            goodMoods: [],
            okayMoods: [],
            notSoGreatMoods: [],
            badMoods: [],
            moodOpts: [],
            moodCategoryId: "",
            selectedMood: "",
            description: "",
            label: "I'm feeling...",
            dropdownOpen: false,
            loader: false,
            check: false,
            allCopingMechs: [],
            greatCopingMechs: [],
            goodCopingMechs: [],
            okayCopingMechs: [],
            notSoGreatCopingMechs: [],
            badCopingMechs: [],
            addModal: false,
            editModal: false,
            copingLabel: "Select a mood category for this coping mechanism",
            AddTitle: "",
            AddUrl: "",
            AddInfo: "",
            AddInfo2: "",
            AddCopingMoodCategoryId: "",
        }


        //Fetch moods from local API by specifying which category to fetch. Then, put those returned promises into new state, and finally setting the state.
        API.getSpecificMood(5)
            .then(greatmoods => newState.greatMoods = greatmoods)
            .then(() => API.getSpecificMood(4))
            .then(goodmoods => newState.goodMoods = goodmoods)
            .then(() => API.getSpecificMood(3))
            .then(okaymoods => newState.okayMoods = okaymoods)
            .then(() => API.getSpecificMood(2))
            .then(notsogreatmoods => newState.notSoGreatMoods = notsogreatmoods)
            .then(() => API.getSpecificMood(1))
            .then(badmoods => newState.badMoods = badmoods)

            //Fetch coping mechs from local API. Put those returned promises into new state and set the state.
            .then(() => API.getSpecificCopingMech(5))
            .then(greatCopingMechs => newState.greatCopingMechs = greatCopingMechs)
            .then(() => API.getSpecificCopingMech(4))
            .then(goodCopingMechs => newState.goodCopingMechs = goodCopingMechs)
            .then(() => API.getSpecificCopingMech(3))
            .then(okayCopingMechs => newState.okayCopingMechs = okayCopingMechs)
            .then(() => API.getSpecificCopingMech(2))
            .then(notSoGreatCopingMechs => newState.notSoGreatCopingMechs = notSoGreatCopingMechs)
            .then(() => API.getSpecificCopingMech(1))
            .then(badCopingMechs => newState.badCopingMechs = badCopingMechs)

            .then(() => API.getAllCopingMechs())
            .then(results => newState.allCopingMechs = results)
            .then(() => this.setState(newState))
    }

    // All other functions to be passed down
    toggleAddModal = () => {
        this.setState(prevState => ({
            addModal: !prevState.modal
        }));
    }
    toggleEditModal = () => {
        this.setState(prevState => ({
            editModal: !prevState.modal
        }));
    }

    toggleExpansion = () => {
        this.setState({ showinfo: !this.state.showinfo })
    }

    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };

    selectMoodCat = (event, value) => {
        this.setState({
            copingLabel: event.target.innerText,
            addCopingMoodCategoryId: value
        })
    }

    changeDesc = (e) => {
        this.setState({ description: e.target.value })
    }

    logNewEntry = () => {
        const time = new Date()
        const splitTime = time.toLocaleTimeString().split(":").join('.')

        this.setState({ loader: true })

        let newEntryObj = {
            userId: this.state.user.id,
            dateLogged: splitTime,
            moodCategoryId: this.state.moodCategoryId,
            selectedMood: this.state.selectedMood,
            description: this.props.description
        }

        API.submitEntry(newEntryObj)
            .then(_result => {
                console.log(_result)
            })

        setTimeout(() => {
            this.props.history.push('/coping')
        }, 3200);
    }

    select = (event, value) => {
        this.setState({
            label: event.target.innerText,
            selectedMood: event.target.innerText,
            moodCategoryId: value
        })
    }

    toggleDropdown = () => {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    submitNewCmEntry = () => {
        const newState = {
            allCopingMechs: [],
            addModal: false
        }
        const newObj = {
            userId: this.state.user.id,
            title: this.state.addTitle,
            url: this.state.addUrl,
            info: this.state.addInfo,
            info2: this.state.addInfo2,
            moodCategoryId: this.state.addCopingMoodCategoryId
        }
        console.log("new entry", newObj)
        API.submitMech(newObj)
            .then(() => API.getAllCopingMechs())
            .then(copingMechs => newState.allCopingMechs = copingMechs)
            .then(() => this.setState(newState))

    }

    updateCmForm = () => {
        const newObj = {
            id: this.props.copingMechId,
            userId: this.state.userId,
            title: this.state.title,
            url: this.state.url,
            info: this.state.info,
            info2: this.state.info2
        }
        console.log("update", newObj)
        let newState = {
            specificCopingMech: [],
            editModal: false
        }
        API.editCopingMech(this.props.copingMechId, newObj)
            .then(() => API.getSpecificCopingMech(this.props.moodCategoryId))
            .then(copingMechs => newState.specificCopingMech = copingMechs)
            .then(() => this.setState(newState))
    }


    render() {
        return (
            <>
                <Route path="/login" render={(props) => <Login {...props} onLogin={(user) => this.setState({ user: user })} />} />
                <Route path="/register" render={(props) => <Register {...props} onRegister={(user) => this.setState({ user: user })} />} />
                <Route exact path="/regulate" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <Regulate {...props} {...this.props} user={this.state.user} onLogout={logout} />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/regulate/new" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <NewRegulate
                                {...props}
                                {...this.props}
                                greatMoods={this.state.greatMoods}
                                goodMoods={this.state.goodMoods}
                                okayMoods={this.state.okayMoods}
                                notSoGreatMoods={this.state.notSoGreatMoods}
                                badMoods={this.state.badMoods}
                                user={this.state.user}
                                logNewEntry={this.logNewEntry}
                                select={this.select}
                                toggleDropdown={this.toggleDropdown}
                                dropdownOpen={this.state.dropdownOpen}
                                label={this.state.label}
                                description={this.state.description}
                                selectedMood={this.state.selectedMood}
                                moodCategoryId={this.state.moodCategoryId}
                                changeDesc={this.changeDesc}
                                loader={this.state.loader}
                                check={this.state.check}
                            />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/entries" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <Entries {...props} user={this.state.user} onLogout={logout} />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/coping" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <Coping
                                {...props}
                                {...this.props}
                                moodCategoryId={this.state.moodCategoryId}
                                user={this.state.user}
                                onLogout={logout}
                                greatCopingMechs={this.state.greatCopingMechs}
                                goodCopingMechs={this.state.goodCopingMechs}
                                okayCopingMechs={this.state.okayCopingMechs}
                                notSoGreatCopingMechs={this.state.notSoGreatCopingMechs}
                                badCopingMechs={this.state.badCopingMechs}
                                selectedMood={this.state.selectedMood}
                                allCopingMechs={this.state.allCopingMechs}
                                toggleDropdown={this.toggleDropdown}
                                dropdownOpen={this.state.dropdownOpen}
                                handleFieldChange={this.handleFieldChange}
                                toggleAddModal={this.toggleAddModal}
                                toggleEditModal={this.toggleEditModal}
                                toggleExpansion={this.toggleExpansion}
                                selectMoodCat={this.selectMoodCat}
                                submitNewCmEntry={this.submitNewCmEntry}
                                copingLabel={this.state.copingLabel}
                                addModal={this.state.addModal}
                                editModal={this.state.editModal}
                                updateCmForm={this.updateCmForm}
                            />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/stats" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <Stats {...props} user={this.state.user} onLogout={logout} />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/findhelp" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <FindHelp {...props} user={this.state.user} onLogout={logout} />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
                <Route exact path="/profile" render={(props) => {
                    return this.state.user ? (
                        <>
                            <TopNav />
                            <Profile {...props} user={this.state.user} onLogout={logout} />
                        </>)
                        : (<Redirect to="/login" />)
                }} />
            </>
        );
    }
}
export default withRouter(Home);