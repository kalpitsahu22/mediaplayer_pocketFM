import React, { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import FullScreen from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";
import SkipNext from "@material-ui/icons/SkipNext";
import SkipPrevious from "@material-ui/icons/SkipPrevious";

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },
  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },
  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const Controls = forwardRef(
  (
    {
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onDuration,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      played,
      elapsedTime,
      totalDuration,
      onMute,
      muted,
      onVolumeSeekDown,
      onChangeDispayFormat,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      volume,
      onVolumeChange,
      onBookmark,
      handleClickNext,
      handleClickPrevious,
      currentURL,
      playerRef,
    },
    ref
  ) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAudioReady, setIsAudioReady] = useState(false);

    useEffect(() => {
      if (currentURL.endsWith(".mp3")) {
        setIsAudioReady(true);
      }
    }, [currentURL]);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleKeyPress = (event) => {
      switch (event.key) {
        case " ":
          onPlayPause();
          break;

        case "ArrowRight":
          onFastForward();
          break;
        case "ArrowLeft":
          onRewind();
          break;
        case "m":
          onMute();
          break;
        case "f":
          onToggleFullScreen();
          break;
        case "Escape":
          onToggleFullScreen();
          break;
        case "n":
          handleClickNext();
          break;
        case "p":
          handleClickPrevious();
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    });

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div ref={ref} className={classes.controlsWrapper} tabIndex={-1}>
        <Grid
          container
          direction="column"
          justify="space-between"
          style={{ flexGrow: 1 }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ padding: 16 }}
          >
            <Grid item>
              <Typography variant="h5" style={{ color: "#fff" }}></Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={onBookmark}
                variant="contained"
                color="primary"
                startIcon={<BookmarkIcon />}
              >
                Bookmark
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <IconButton
              onClick={onRewind}
              className={classes.controlIcons}
              aria-label="rewind"
            >
              <FastRewindIcon
                className={classes.controlIcons}
                fontSize="inherit"
              />
            </IconButton>
            <IconButton
              onClick={onPlayPause}
              className={classes.controlIcons}
              aria-label="play"
            >
              {playing ? (
                <PauseIcon fontSize="inherit" />
              ) : (
                <PlayArrowIcon fontSize="inherit" />
              )}
            </IconButton>
            <IconButton
              onClick={onFastForward}
              className={classes.controlIcons}
              aria-label="forward"
            >
              <FastForwardIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ padding: 16 }}
          >
            <Grid item xs={12}>
              <PrettoSlider
                min={0}
                max={100}
                ValueLabelComponent={(props) => (
                  <ValueLabelComponent {...props} value={elapsedTime} />
                )}
                aria-label="custom thumb label"
                value={played * 100}
                onChange={onSeek}
                onMouseDown={onSeekMouseDown}
                onChangeCommitted={onSeekMouseUp}
                onDuration={onDuration}
              />
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  fontSize="large"
                  className={classes.bottomIcons}
                  onClick={handleClickPrevious}
                >
                  <SkipPrevious />
                </IconButton>
                <IconButton
                  onClick={onPlayPause}
                  className={classes.bottomIcons}
                >
                  {playing ? (
                    <PauseIcon fontSize="large" />
                  ) : (
                    <PlayArrowIcon fontSize="large" />
                  )}
                </IconButton>
                <IconButton
                  fontSize="large"
                  className={classes.bottomIcons}
                  onClick={handleClickNext}
                >
                  <SkipNext />
                </IconButton>
                <IconButton onClick={onMute} className={classes.bottomIcons}>
                  {muted ? (
                    <VolumeMute fontSize="large" />
                  ) : volume > 0.5 ? (
                    <VolumeUp fontSize="large" />
                  ) : (
                    <VolumeDown fontSize="large" />
                  )}
                </IconButton>
                <Slider
                  min={0}
                  max={100}
                  value={muted ? 0 : volume * 100}
                  onChange={onVolumeChange}
                  aria-labelledby="input-slider"
                  className={classes.volumeSlider}
                  onMouseDown={onSeekMouseDown}
                  onChangeCommitted={onVolumeSeekDown}
                />
                <Button variant="text" onClick={onChangeDispayFormat}>
                  <Typography
                    variant="body1"
                    style={{ color: "#fff", marginLeft: 16 }}
                  >
                    {elapsedTime}/{totalDuration}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClick}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography>{playbackRate}X</Typography>
              </Button>
              <Popover
                container={ref.current}
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => onPlaybackRateChange(rate)}
                      variant="text"
                    >
                      <Typography
                        color={rate === playbackRate ? "secondary" : "inherit"}
                      >
                        {rate}X
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
              <IconButton
                onClick={onToggleFullScreen}
                className={classes.bottomIcons}
              >
                <FullScreen fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {isAudioReady && (
          <ReactPlayer
            ref={playerRef}
            url={currentURL}
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onDuration={onDuration}
            width="100%"
            height="100%"
          />
        )}
      </div>
    );
  }
);

Controls.propTypes = {
  onSeek: PropTypes.func,
  onSeekMouseDown: PropTypes.func,
  onSeekMouseUp: PropTypes.func,
  onDuration: PropTypes.func,
  onRewind: PropTypes.func,
  onPlayPause: PropTypes.func,
  onFastForward: PropTypes.func,
  onVolumeSeekDown: PropTypes.func,
  onChangeDispayFormat: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
  elapsedTime: PropTypes.string,
  totalDuration: PropTypes.string,
  muted: PropTypes.bool,
  playbackRate: PropTypes.number,
  handleClickNext: PropTypes.func.isRequired,
  handleClickPrevious: PropTypes.func.isRequired,
  currentURL: PropTypes.string.isRequired,
  playerRef: PropTypes.object.isRequired,
};

export default Controls;
