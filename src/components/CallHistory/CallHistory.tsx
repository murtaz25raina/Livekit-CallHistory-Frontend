import { useSelector } from "react-redux";
import { selectCallHistoryState } from "redux/stores/callHistory/callHistory";
import "./CallHistory.css";
import { getTimeDifference } from "helpers/currentTime";

const CallHistoryComponent = () => {
    const { calls } = useSelector(selectCallHistoryState);
    return (
        <div className="n-call-history-container">
            {calls.length > 0 ? (
                <div>
                    <h2>Call History</h2>
                    {calls.map((call, index) => (
                        <div key={index} className="n-call-entry">
                            <div className="n-call-detail">
                                <label className="n-label">Caller Name:</label>
                                <span className="n-caller-name">{call.callerName}</span>
                            </div>
                            <div className="n-call-detail">
                                <label className="n-label">Call Type:</label>
                                <span className="n-call-type">{call.callType}</span>
                            </div>
                            <div className="n-call-detail">
                                <label className="n-label">Call Status:</label>
                                <span className="n-call-status">{call.callStatus}</span>
                            </div>
                            <div className="n-call-detail">
                                <label className="n-label">Call Time:</label>
                                <span className="n-call-time">{call.callTime}</span>
                            </div>
                            <div className="n-call-detail">
                                <label className="n-label">Call Duration:</label>
                                <span className="n-call-duration">
                                    {getTimeDifference(call.callStartTime,call.callEndTime)}</span>
                            </div>
                            <div className="n-call-detail">
                                <label className="n-label">Receiver Name:</label>
                                <span className="n-receiver-name">{call.recieverName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="n-no-call-history">No Call History</div>
            )}
        </div>
    );
}

export default CallHistoryComponent;
