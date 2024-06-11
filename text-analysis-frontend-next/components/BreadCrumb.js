import 'bootstrap/dist/css/bootstrap.min.css'

// TODO: Send props in to control items in the breadcrumb e.g. { name:'city, ...', href:'/...' }

export default function Breadcrumb(props){
    console.log("Breadcrumb | props: ", props)
  let breadcrumbLinks = props.breadcrumbLinks

  if (typeof breadcrumbLinks == 'undefined'){
    // TODO: Fix this.
    // For some reason the links aren't coming through properly from initialResultsWindow.js.

    breadcrumbLinks = [
      {
        'name': 'City, University of London',
        'href': '/ViewModules?institution=city_university_of_london',
        'status': 'inactive'
      },
      {
        'name': 'Java 23/24',
        'href': '/ViewChecks?institution=city_university_of_london&module=java_2324',
        'status': 'inactive'
      },
      {
        'name': 'Coursework 1',
        'href': '/InitialResults?institution=city_university_of_london&module=java_2324&check_name=coursework_1',
        'status': 'active'
      }
    ]
  }

  return (
    <div className="row" style={{paddingTop: "2vh"}}>
        
        <div className="col">

          <div className="container-fluid">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">

                {
                  breadcrumbLinks.map((item, index) => {
                    if (item.status == 'active'){
                      return <li className='breadcrumb-item active' aria-current='page'>{item.name}</li>
                    }else{
                      return <li className='breadcrumb-item'>
                        <a href={item.href}>
                          {item.name}
                        </a>
                      </li>
                    }
                  })
                }

              </ol>
            </nav>
          </div>

        </div>

      </div>

  )
}
