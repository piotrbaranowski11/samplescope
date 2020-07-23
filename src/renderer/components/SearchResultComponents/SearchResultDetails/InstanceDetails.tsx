import React from 'react';
import { Download, DownloadCloud, Clock } from 'react-feather';

interface Props {
  sample: SelectedSample;
}

const formatSampleRate = (rate: number) => rate / 1000 + ' kHz';
const formatDuration = (d: number) => {
  const durationRound2Decimal = d ? Math.floor(d * 100) / 100 : 0;
  return durationRound2Decimal + 's';
};
const formatChannels = (channels: number): string => {
  if (channels === 1) return 'Mono';
  else if (channels === 2) return 'Stereo';
  else return channels.toString();
};

const formatBytesToSize = (bytes: number) => {
  var sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
  if (bytes === 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const DetailsRow = ({ name, value }) => (
  <div className="detailsRow">
    <div className="detailsCellTh">
      <small>{name}</small>
    </div>
    <div className="detailsCellValue">{value}</div>
  </div>
);

const InstanceDetails: React.FunctionComponent<Props> = ({ sample }: Props) => {
  // assume details not loaded if `download` property doesn't exist
  if (sample.download === undefined) return null;

  const duration = formatDuration(sample.duration);
  const sampleRate = formatSampleRate(sample.samplerate);
  const channels = formatChannels(sample.channels);
  const filesize = formatBytesToSize(sample.filesize);
  const bitrate = sample.bitrate + ' Kbps';

  return (
    <>
      <div className="detailsTable">
        <div className="detailsCol">
          <DetailsRow key="duration" name="duration" value={duration} />
          <DetailsRow key="samplerate" name="samplerate" value={sampleRate} />
          <DetailsRow key="bitdepth" name="bitdepth" value={sample.bitdepth} />
          <DetailsRow key="bitrate" name="bitrate" value={bitrate} />
        </div>
        <div className="detailsCol">
          <DetailsRow key="type" name="type" value={sample.type} />
          <DetailsRow key="channels" name="channels" value={channels} />
          <DetailsRow key="filesize" name="filesize" value={filesize} />
          <DetailsRow
            key="downloads"
            name="downloads"
            value={sample.num_downloads}
          />
        </div>
      </div>

      {/* <div className="download-button">
            <button
            className="tertiary"
            onClick={e => handleDownloadFile(sample, e)}
            >
            <Download /> Download
            </button>{' '}
          </div> */}

      <div>{sample.description}</div>
    </>
  );
};

export default InstanceDetails;
