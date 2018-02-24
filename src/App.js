import Papa from 'papaparse';
import moment from 'moment';

import React, { Component } from 'react';
import 'react-table/react-table.css';

import './App.css';


import occurrences from './occurrences';
import OccurrenceTable from './OccurrenceTable';
import { BasicModal, Modal, ModalPortalHOC } from './Modal';
import Button from './Button';

export default class App extends Component {
  static loadData() {
    return JSON.parse(localStorage.getItem('occ')) || occurrences.record;
  }

  static saveData(data) {
    localStorage.setItem('occ', JSON.stringify(data));
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: App.loadData(),
      showModal: false,
    };

    this.modalPortal = ModalPortalHOC(
      Button,
      <BasicModal
        header='Hello'
        body='you'
        onAccept={() => this.closeModal()}
        onCancel={() => this.closeModal()}
      />
    );
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  csv() {
    const { data } = this.state;

    // Add recency column and format date
    const newData = data.map(row => {
      const { firstName, lastName, lastOccurrence: date } = row;
      const lastOccurrence = date !== null ? moment(date).format('MMM DD YYYY') : null;
      const recency = row.lastOccurrence === null ? null : moment().diff(moment(row.lastOccurrence), 'days');

      return { firstName, lastName, lastOccurrence, recency };
    });

    const csv = Papa.unparse(newData);

    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURI(text)}`);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    download('test.csv', csv);
  }

  async handleUpload(e) {
    const file = e.target.files[0];

    const result = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = () => {
        reject(new Error('There was a problem reading the file.'))
      };

      reader.readAsText(file);
    });

    const { data } = Papa.parse(result, { header: true });

    this.setState({ data });
  }

  update(data) {
    this.setState({ data });
  }

  render() {
    const { showModal, data } = this.state;
    const ModalPortal = this.modalPortal;
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <OccurrenceTable updateAppState={d => this.update(d)} save={App.saveData} data={data} />
        <ModalPortal showModal={showModal}>Modal</ModalPortal>
        <Button onClick={() => this.csv()}>CSV</Button>
        <input ref={ref => { this.upload = ref; }} type='file' accept='.csv' style={{display: 'none'}} onChange={(e) => this.handleUpload(e)} />
        <Button onClick={() => this.upload.click()}>Upload</Button>
      </div>
    );
  }
}
