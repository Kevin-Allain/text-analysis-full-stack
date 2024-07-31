import 'bootstrap/dist/css/bootstrap.min.css'

// TODO: Send props in to control items in the breadcrumb e.g. { name:'city, ...', href:'/...' }

export default function Breadcrumb(props){
  console.log("Breadcrumb | props: ", props)
  // if (typeof localStorage.formData === 'string'){
  //   localStorage.formData = JSON.parse(localStorage.formData);
  // }
  console.log("Breadcrumb | localStorage.formData: ",localStorage.formData,", typeof localStorage.formData: ",typeof localStorage.formData);
  let breadcrumbLinks = props.breadcrumbLinks;
  let objFormData = JSON.parse(localStorage.formData);
  console.log("Breadcrumb |objFormData: ",objFormData)
  // console.log("localStorage.formData.institution: ",localStorage.formData.institution);
  // console.log("localStorage.formData.module: ",localStorage.formData.module);
  // console.log("localStorage.formData.name: ",localStorage.formData.name);

  // TODO should links be fixed?
  if (typeof localStorage.formData === 'undefined' ) {
    // For some reason the links aren't coming through properly from initialResultsWindow.js.
    breadcrumbLinks = [
      { 'name': 'City, University of London', 'href': '/ViewModules?institution=city_university_of_london', 'status': 'inactive' },
      { 'name': 'Java 23/24', 'href': '/ViewChecks?institution=city_university_of_london&module=java_2324', 'status': 'inactive' },
      { 'name': 'Coursework 1', 'href': '/InitialResults?institution=city_university_of_london&module=java_2324&check_name=coursework_1', 'status': 'active' }
    ]
  } else  {
    breadcrumbLinks = [
      {
        'name': objFormData.institution,
        // 'href': '/ViewModules?institution=city_university_of_london',
        'status': 'inactive'
      },
      {
        'name': objFormData.module,
        // 'href': '/ViewChecks?institution=city_university_of_london&module=java_2324',
        'status': 'inactive'
      },
      {
        'name': objFormData.name,
        // 'href': '/InitialResults?institution=city_university_of_london&module=java_2324&check_name=coursework_1',
        // 'status': 'active'
        'status': 'inactive'
      }
    ]

  }

  // TODO assess whether we wish to keep the links...
  return (
    <div className="row" style={{paddingTop: "2vh"}}>
        <div className="col">
          <div className="container-fluid">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {
                  breadcrumbLinks.map((item, index) => {
                    if (item.status == 'active'){
                      return <li key={index} className='breadcrumb-item active' aria-current='page'>{item.name}</li>
                    }else{
                      return <li key={index} className='breadcrumb-item'>
                        <a key={index} href={item.href}>
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
