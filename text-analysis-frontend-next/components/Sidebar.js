import "bootstrap/dist/css/bootstrap.min.css";

// TODO how should we pass arguments for Sidebar?!
export default function Sidebar(props) {
  
  const filesets = props.filesets? props.filesets : [];


  if (filesets.length > 0) {
    return (
      <div className="col-md-2" style={{ padding: 0 }}>
        <ul
          className="list-group list-group-flush"
          style={{
            borderRight: "1px solid #eee",
            minHeight: "95vh",
            maxHeight: "95vh",
          }}
        >
          <li
            className="list-group-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Your File Sets</span>
            <a href="/NewFile Set" className="btn btn-sm btn-outline-primary">
              New File Set
            </a>
          </li>
          {filesets.map((fileset) => {
            return (
              <li key={fileset.id} className="list-group-item">
                {fileset.institution}
                <ul className="list-group">
                  {fileset.modules.map((module) => {
                    return (
                      <li key={module.id} className="list-group-item">
                        {module.name}
                        <ul className="list-group">
                          {module.courseworks.map((coursework) => {
                            return (
                              <li
                                key={coursework.id}
                                className="list-group-item"
                              >
                                {coursework.name}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="col-md-2" style={{ padding: 0 }}>
        <ul
          className="list-group
          list-group-flush"
          style={{
            borderRight: "1px solid #eee",
            minHeight: "95vh",
            maxHeight: "95vh",
          }}
        >
          <li
            className="list-group-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Your File Sets</span>
            <button type="button" className="btn btn-sm btn-outline-primary">
              New File Set
            </button>
          </li>
          <li
            className="list-group-item"
            style={{
              height: "85vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#666",
              textAlign: "center",
            }}
          >
            Upload your files on the right to get started.
          </li>
        </ul>
      </div>
    );
  }
}
