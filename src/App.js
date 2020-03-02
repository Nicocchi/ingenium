import React from 'react';
import './App.css';
import Container from "./Container"

function App() {
  const [image, setValue] = React.useState(0);



  const handleClick = (event, newValue) => {
    event.preventDefault()
    const location = window.ipcRenderer.send("dialog-event");
    if (location !== null || location !== undefined) {
      setValue(newValue);
      console.log(image);
    }

    return;
  }

  return (
    <Container handleOpen={handleClick} image={image} />
  //   <Tabs className="react-tabs">
  //     <TabList className="react-tabs__tab-list">
  //       <Tab className="react-tabs__tab">Wallpapers</Tab>
  //       <Tab className="react-tabs__tab">Preferences</Tab>
  //     </TabList>

  //     <TabPanel>
  //       <h2>Any content 1</h2>
  //       <button onClick={onClick}>Open Video</button>
  //     </TabPanel>
  //     <TabPanel>
  //       <h2>Any content 2</h2>
  //     </TabPanel>
  // </Tabs>
  );
}

export default App;
