import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';
import data from './data.json';

// const Marker = ({ text, style, ...rest }) => {
//   console.log(...rest);
//   return <div style={style}>{text}</div>;
// };

console.log(supercluster);

class Marker extends Component {
  render() {
    const { text, style, ...rest } = this.props;
    console.log(...rest);
    return <div style={style}>{text}</div>;
  }
}

class SimpleMap extends Component {
  constructor(props) {
    super(props);

    this.clusterRadius = 60;

    this.state = {
      center: { lat: 37.566741, lng: 126.985045 },
      zoom: 11,
    };

    this.onChange = this.onChange.bind(this);
    this.onChoose = this.onChoose.bind(this);
  }

  onChange(mapProps) {
    console.log('onChange mapProps', mapProps);
    this.setState({ ...mapProps });
  }

  onChoose(...e) {
    console.log('onChoose', e);
    const { lat, lng } = e[1];
    this.setState({ center: { lat, lng } });
  }

  render() {
    console.log('SimpleMap render state', this.state);
    const { bounds } = this.state;

    let clusters;

    if (bounds) {
      const fn = supercluster(data, {
        minZoom: 3, // min zoom to generate clusters on
        maxZoom: 15, // max zoom level to cluster the points on
        radius: this.clusterRadius, // cluster radius in pixels
      });
      clusters = fn(this.state);

      console.log('clusters', fn, clusters);
    }
    return (
      // Important! Always set the container height explicitly <--- GoogleMapReact's requirement
      // https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height  <--- tricky solution;?
      <div style={{ flexGrow: 1, height: '1px' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyDp9Dyo64oyi5FrF_1Z_ksZsTcblDuxldU',
            }}
            center={this.state.center}
            zoom={this.state.zoom}
            onChange={this.onChange}
            onChildClick={this.onChoose}
          >
            {/* <TextComponent lat={37.566741} lng={126.985045} text="ahhhhh" /> */}
            {clusters
              ? clusters.map((marker) => {
                const {
                  wy, wx, numPoints, points, ...rest
                } = marker;

                const id = `${numPoints}_${points[0].id}`;

                // check if it is on fire
                const l = points.length;
                let fireCount = 0;
                for (let i = 0; i < l; i++) {
                  if (points[i].onfire) {
                    fireCount++;
                  }
                }

                return (
                  <Marker
                    style={{
                      fontSize: '20px',
                      width: '30px',
                      height: '30px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '50%',
                      color: fireCount > 0 ? 'red' : 'black',
                      zIndex: 20,
                    }}
                    lat={wy}
                    lng={wx}
                    key={id}
                    id={id}
                    text={numPoints > 1 ? numPoints.toString() : '*'}
                    {...rest}
                  />
                );
              })
              : null}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default SimpleMap;
