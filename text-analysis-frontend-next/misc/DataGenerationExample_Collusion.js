function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function generateFiles() {
    const fileNames = [
      "Addresses.py", "attack_control.py", "attack_paraphrase.py", "CameraFollowPredator.cs",
      "cold_decoding.py", "evaluate.py", "ggplot_tips.R", "index.vue", "INSTALL.txt",
      "NLP_LBS1_answers.R", "old_PredatorMovement.cs", "PredatorMovement.cs", "PreyEvading.cs",
      "text_basics.R", "vectorFunctions.R"
    ];
    const numFiles = getRandomInt(1, 3);
    const files = [];
    for (let i = 0; i < numFiles; i++) {
      const randomIndex = getRandomInt(0, fileNames.length - 1);
      files.push(fileNames[randomIndex]);
    }
    return files;
  }
  
  function generateCollusionScores(numFiles1, numFiles2) {
    const scores = [];
    for (let i = 0; i < numFiles1; i++) {
      const innerScores = [];
      for (let j = 0; j < numFiles2; j++) {
        innerScores.push(getRandomFloat(0, 1).toFixed(2));
      }
      scores.push(innerScores);
    }
    return scores;
  }
  
  function generateUser(name, allNames) {
    const files = generateFiles();
    const numSubmissions = files.length;
    const relations = allNames.filter(n => n !== name).map(otherName => ({
      name: otherName,
      collusionScores: generateCollusionScores(numSubmissions, getRandomInt(1, 3))
    }));
    return {
      name: name,
      globalScore: null,
      numSubmissions: numSubmissions,
      files: files,
      scoreDetails: {
        globalScore: getRandomFloat(0, 1).toFixed(2),
        relations: relations
      }
    };
  }
  
  function generateData() {
    const userNames = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack"];
    const data = userNames.map(name => generateUser(name, userNames));
    return { data: data };
  }
  
  const jsonData = generateData();
  console.log(JSON.stringify(jsonData, null, 2));
  
  

  // // New creation 2024/07/23
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateScores() {
    const scoreTitles = ["AI_Detection", "Collusion", "Plagiarism"];
    const scores = {};
    scoreTitles.forEach(title => {
      scores[title] = getRandomInt(0, 100);
    });
    return scores;
  }
  
  function generateCourseworks() {
    const courseworkTitles = ["Coursework 1", "Coursework 2", "Coursework 3", "Coursework 4", "Coursework 5"];
    const numCourseworks = getRandomInt(1, courseworkTitles.length);
    const courseworks = {};
    for (let i = 0; i < numCourseworks; i++) {
      courseworks[courseworkTitles[i]] = generateScores();
    }
    return courseworks;
  }
  
  function generateModules() {
    const modules = ["TypeScript 2024", "Java Intro 2021", "Unity Engine 2022", "Stock Prediction 2023"];
    const moduleData = {};
    modules.forEach(module => {
      moduleData[module] = generateCourseworks();
    });
    return moduleData;
  }
  
  function generateStudentData(name) {
    const universities = ["Oxford", "Cambridge", "City, University of London", "Warwick", "Imperial"];
    return {
      name: name,
      university: universities[getRandomInt(0, universities.length - 1)],
      modules: generateModules()
    };
  }
  
  const userNames = [
    "Alice Black", "Bob Vance", "Charlie Meyers", "David Wallace", "Ethan Drake",
    "Francis Croshaw", "Gale Grimm", "Hugo Martin", "Ines Arabelle", "Julian Johnson",
    "Karim Smith", "Leo Lionel", "Maxim Romero"
  ];
  
  const data = userNames.map(name => generateStudentData(name));
  
  console.log(JSON.stringify(data, null, 2));
  