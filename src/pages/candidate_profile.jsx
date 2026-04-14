import React, { useState, useEffect } from 'react';
import './CandidateProfile.css';
import CandidateDashboardHeader from '../component/CandidateDashboardHeader';
import EducationPopup from '../component/EducationPopup';
import GraduationModal from '../component/GraduationModal';
import PhdDetails from '../component/PhdDetails';
import DiplomaDetails from '../component/DiplomaDetails';
import SecondaryEducationForm from '../component/SecondaryEducationForm';
import AddJobModal from '../component/AddJobModal';
import AddSkill from '../component/AddSkill';
import ProjectDetailsModal from '../component/ProjectDetailsModal';
import TrainingDetailsModal from '../component/TrainingDetailsModal';
import Lenis from 'lenis';
import profileImage from '../assets/candidate_profile.png';

/**
 * Small helpers so UI never sees undefined for arrays/objects
 */
const arr = (v) => (Array.isArray(v) ? v : []);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

/**
 * Normalize backend object into a safe shape for the frontend
 */
const normalizeCandidate = (raw = {}) => ({
  name: raw.name || '',
  email: raw.email || '',
  phone: raw.phone || '',
  graduation: raw.graduation ?? null,
  // backend may supply education as string or array; prefer array
  education: Array.isArray(raw.education) ? raw.education : (typeof raw.education === 'string' ? parseEducationString(raw.education) : []),
  secondaryeducation: raw.secondaryeducation ? obj(raw.secondaryeducation) : null,
  diploma: raw.diploma ? obj(raw.diploma) : null,
  phd: raw.phd ? obj(raw.phd) : null,
  jobs: Array.isArray(raw.jobs) ? raw.jobs : (typeof raw.jobs === 'string' ? parseJobsString(raw.jobs) : []),
  careerObjective: raw.careerObjective || '',
  extraCurricular: raw.extraCurricular || '',
  trainingsCourses: Array.isArray(raw.trainingsCourses) ? raw.trainingsCourses : [],
  academicProjects: Array.isArray(raw.academicProjects) ? raw.academicProjects : (typeof raw.academicProjects === 'string' ? parseProjectsString(raw.academicProjects) : []),
  portfolioSamples: Array.isArray(raw.portfolioSamples) ? raw.portfolioSamples : (typeof raw.portfolioSamples === 'string' ? parsePortfolioString(raw.portfolioSamples) : []),
  skills: Array.isArray(raw.skills) ? raw.skills : (typeof raw.skills === 'string' ? raw.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
  resume: raw.resume || raw.resumeFileName || null,
  user: raw.user || null,
  ...raw,
});

/** Parsing helpers for backend stringified fields (used by your controller) */
function parseEducationString(s) {
  // controller stores education as "degree - institution (year); degree2 - inst2 (year2)"
  if (!s || typeof s !== 'string') return [];
  return s.split(';').map(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    // try to extract degree / institution / year
    const yearMatch = trimmed.match(/\((.*?)\)\s*$/);
    const year = yearMatch ? yearMatch[1] : '';
    const before = yearMatch ? trimmed.replace(/\((.*?)\)\s*$/, '').trim() : trimmed;
    const parts = before.split(' - ').map(p => p.trim());
    return {
      degree: parts[0] || '',
      institution: parts[1] || '',
      year: year || ''
    };
  }).filter(Boolean);
}

function parseJobsString(s) {
  // controller stores jobs like "role @ company (duration); role2 @ company2 (duration2)"
  if (!s || typeof s !== 'string') return [];
  return s.split(';').map(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    const durMatch = trimmed.match(/\((.*?)\)\s*$/);
    const duration = durMatch ? durMatch[1] : '';
    const before = durMatch ? trimmed.replace(/\((.*?)\)\s*$/, '').trim() : trimmed;
    const parts = before.split('@').map(p => p.trim());
    return {
      designation: parts[0] || '',
      organization: parts[1] || '',
      duration,
      // if you want to split duration into start/end, you can do that later
      startDate: duration.split(' - ')[0] || '',
      endDate: duration.split(' - ')[1] || ''
    };
  }).filter(Boolean);
}

function parseProjectsString(s) {
  // "Title: description; Title2: description2"
  if (!s || typeof s !== 'string') return [];
  return s.split(';').map(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(':').map(p => p.trim());
    return {
      title: parts[0] || '',
      description: parts.slice(1).join(':') || ''
    };
  }).filter(Boolean);
}

function parsePortfolioString(s) {
  // "title - link; title2 - link2"
  if (!s || typeof s !== 'string') return [];
  return s.split(';').map(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(' - ').map(p => p.trim());
    return { title: parts[0] || '', link: parts[1] || '' };
  }).filter(Boolean);
}

const CandidateProfile = () => {
  // Initialize profile state with proper array structure
  const [profile, setProfile] = useState(
    normalizeCandidate({
      graduation: null,
      education: [],
      secondaryeducation: null,
      diploma: null,
      phd: null,
      jobs: [],
      careerObjective: '',
      extraCurricular: '',
      trainingsCourses: [],
      academicProjects: [],
      portfolioSamples: [],
      skills: [],
      resume: null,
    })
  );

  // State for resume upload
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showGraduationModal, setShowGraduationModal] = useState(false);
  const [showSecondaryEducation, setShowSecondaryEducation] = useState(false);
  const [showDiplomaDetails, setShowDiplomaDetails] = useState(false);
  const [showPhdDetails, setShowPhdDetails] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showExtraCurricularModal, setShowExtraCurricularModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sample, setSample] = useState({ title: '', link: '' });

  // On mount: try to fetch an existing saved candidate (by resumeFileName)
  useEffect(() => {
    // set initial empty / demo state if you want
    const defaults = normalizeCandidate({
      name: '',
      email: '',
      phone: '',
      graduation: null,
      education: [],
      secondaryeducation: null,
      diploma: null,
      phd: null,
      jobs: [],
      careerObjective: '',
      extraCurricular: '',
      trainingsCourses: [],
      academicProjects: [],
      portfolioSamples: [],
      skills: [],
      resume: null,
    });
    setProfile(defaults);

   const loadSavedCandidate = async () => {

  try {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.userId) {

      console.log("Loading resumes for userId:", user.userId);

      const resumes = await fetchCandidateByResume(user.userId);

      if (resumes.length > 0) {

        setProfile(normalizeCandidate(resumes[0]));

      }

    }

  } catch (err) {

    console.error("loadSavedCandidate error:", err);

  }

};

    loadSavedCandidate();

    // Lenis smooth scrolling initialization (your existing usage)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

// Parse resume (frontend-only call to /parseResume)
const handleResumeUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file || file.type !== 'application/pdf') {
    alert('Please upload a valid PDF file.');
    return;
  }
  setResumeFile(file);

  const formData = new FormData();
  formData.append('resume', file);

  try {
    const res = await fetch('http://localhost:8080/api/resume/parseResume', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Resume parse failed: ${res.status} ${res.statusText}`);

    const body = await res.json();
    const structuredData = body?.structuredData ?? {};
    console.log('[CandidateProfile] Parsed structuredData:', structuredData);

    const educationList = Array.isArray(structuredData.education) ? structuredData.education : [];

    const findEducation = (keyword) =>
      educationList.find((ed) => ed.degree?.toLowerCase().includes(keyword.toLowerCase())) || null;

    const graduation = (() => {
      const grad = findEducation('bachelor');
      return grad ? {
        degree: grad.degree || '',
        stream: grad.degree?.split(' in ')[1] || '',
        college: grad.institution || '',
        startYear: grad.year?.split(' - ')[0] || '',
        endYear: grad.year?.split(' - ')[1] || '',
        percentage: '',
      } : null;
    })();

    const secondaryeducation = (() => {
      const sec = findEducation('chse') || findEducation('secondary') || educationList[0];
      return sec ? {
        board: sec.institution || '',
        year: sec.year || '',
        scoreType: 'Percentage',
        scoreValue: '',
      } : null;
    })();

    const diploma = (() => {
      const dip = findEducation('diploma');
      return dip ? {
        stream: dip.degree?.split(' in ')[1] || '',
        college: dip.institution || '',
        startYear: dip.year?.split(' - ')[0] || '',
        endYear: dip.year?.split(' - ')[1] || '',
      } : null;
    })();

    const phd = (() => {
      const phdEntry = findEducation('phd');
      return phdEntry ? {
        stream: phdEntry.degree?.split(' in ')[1] || '',
        college: phdEntry.institution || '',
        startYear: phdEntry.year?.split(' - ')[0] || '',
        endYear: phdEntry.year?.split(' - ')[1] || '',
      } : null;
    })();

    setProfile((prev) =>
      normalizeCandidate({
        ...prev,
        username: localStorage.getItem('username') || '',
        name: structuredData.fullName || prev.name,
        email: structuredData.email || prev.email,
        phone: structuredData.phone || prev.phone,
        careerObjective: structuredData.careerObjective || prev.careerObjective,
        skills: Array.isArray(structuredData.skills) ? structuredData.skills : [],
        portfolioSamples: Array.isArray(structuredData.portfolioSamples) ? structuredData.portfolioSamples : [],
        academicProjects: Array.isArray(structuredData.projects)
          ? structuredData.projects.map((p) => ({ title: p.title || '', description: p.description || '' }))
          : [],
        jobs: Array.isArray(structuredData.experience)
          ? structuredData.experience.map((exp) => {
              const [start, end] = (exp.duration || '').split(' - ');
              return {
                designation: exp.role || '',
                organization: exp.company || '',
                startDate: start || '',
                endDate: end || '',
                currentlyWorking: (end || '').toLowerCase().includes('present'),
                description: exp.description || '',
              };
            })
          : [],
        education: educationList,
        graduation,
        secondaryeducation,
        diploma,
        phd,
        resume: file.name,
      })
    );
  } catch (err) {
    console.error('[CandidateProfile] handleResumeUpload error:', err);
    alert(`Failed to upload/parse resume: ${err?.message ?? err}`);
  }
};

// Save parsed profile to backend and persist resumeFileName for later fetch
const saveProfile = async () => {
  if (!resumeFile) {
    alert("Please upload a resume first.");
    return;
  }

  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    // ✅ Read user object from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.userId || isNaN(Number(user.userId))) {
      alert("Cannot save profile: userId missing/invalid. Please login again.");
      setIsUploading(false);
      return;
    }

    // Optionally append userId if backend requires it
    formData.append("userId", user.userId);

    const res = await fetch("http://localhost:8080/api/resume/uploadResume", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token || ""}`, // ✅ correct token
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const body = await res.json();
    console.log("[CandidateProfile] uploadResume response:", body);
    alert("Profile saved successfully.");

    const resumeFileName = body?.resumeFileName || body?.savedCandidate?.resumeFileName || null;
    if (resumeFileName) {
      localStorage.setItem("resumeFileName", resumeFileName);

      // Fetch candidate only if a resume was uploaded
      const candidate = await fetchCandidateByResume(resumeFileName);
      if (candidate) setProfile(normalizeCandidate(candidate));
    }
  } catch (err) {
    console.error("[CandidateProfile] saveProfile error:", err);
    alert("Error saving profile: " + (err?.message ?? err));
  } finally {
    setIsUploading(false);
  }
};



// Fetch candidate by resumeFileName (backend endpoint)
const fetchCandidateByResume = async (userId) => {

  if (!userId) {
    console.warn('[CandidateProfile] fetchCandidateByResume called without userId');
    return [];
  }

  try {

    console.log('[CandidateProfile] Fetching resumes for userId:', userId);

    const resp = await fetch(
      `http://localhost:8080/api/resume/candidateByResume/${userId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' }
      }
    );

    if (!resp.ok) {
      console.warn('[CandidateProfile] API returned status', resp.status);
      return [];
    }

    const data = await resp.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[CandidateProfile] No resumes found');
      return [];
    }

    const parsedResumes = data.map((item) => ({
      ...item,

      skills: Array.isArray(item.skills)
        ? item.skills
        : typeof item.skills === 'string'
        ? item.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [],

      portfolioSamples: Array.isArray(item.portfolioSamples)
        ? item.portfolioSamples
        : typeof item.portfolioSamples === 'string'
        ? parsePortfolioString(item.portfolioSamples)
        : [],

      academicProjects: Array.isArray(item.academicProjects)
        ? item.academicProjects
        : typeof item.academicProjects === 'string'
        ? parseProjectsString(item.academicProjects)
        : [],

      jobs: Array.isArray(item.jobs)
        ? item.jobs
        : typeof item.jobs === 'string'
        ? parseJobsString(item.jobs)
        : [],

      education: Array.isArray(item.education)
        ? item.education
        : typeof item.education === 'string'
        ? parseEducationString(item.education)
        : [],

      trainingsCourses: Array.isArray(item.trainingsCourses)
        ? item.trainingsCourses
        : []
    }));

    return parsedResumes;

  } catch (err) {

    console.error('[CandidateProfile] fetchCandidateByResume error:', err);
    return [];

  }
};

// ✅ Optional: fetch saved candidate on page load
useEffect(() => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user?.userId) {

    fetchCandidateByResume(user.userId).then((resumes) => {

      if (resumes.length > 0) {

        // show latest resume
        setProfile(normalizeCandidate(resumes[0]));

      }

    });

  }

}, []);


  const handleAddSample = () => {
    if (sample.title && sample.link) {
      setProfile((prev) => ({ ...prev, portfolioSamples: [...arr(prev.portfolioSamples), sample] }));
      setSample({ title: '', link: '' });
      setShowSampleModal(false);
    }
  };

  const handleAddEducation = (type) => {
    setShowModal(false);
    if (type === 'graduation') setShowGraduationModal(true);
    if (type === 'secondary') setShowSecondaryEducation(true);
    if (type === 'diploma') setShowDiplomaDetails(true);
    if (type === 'phd') setShowPhdDetails(true);
  };

  const handleJobSave = (jobData) => {
    setProfile((prev) => ({ ...prev, jobs: [...arr(prev.jobs), jobData] }));
    setShowJobModal(false);
  };

  // ---------- Render ----------
  return (
    <>
      <CandidateDashboardHeader />

      <div className="profile-container">
        <div className="profile-card">
          <div className="top-section">
            <div className="left-side">
              <div className="profile-picture-section">
                <img src={profileImage} alt="Profile" className="profile-picture" />
              </div>
              <div className="basic-info">
                <p><strong>Full Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
              </div>
            </div>

            <div className="right-side">
              <div className="input-block">
                <label>Education:</label>

                <div className="education-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <button className="add-edu-btn" onClick={() => setShowModal(true)}>+</button>
                  <span>Add Your Education</span>
                </div>

                {Array.isArray(profile.education) && profile.education.length > 0 ? (
                  <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '12px', color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>Educational Qualifications</h4>
                    {profile.education.map((edu, index) => (
                      <div key={index} style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '12px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                        <h5 style={{ margin: '0 0 6px', color: '#007bff', fontSize: '16px' }}>{edu?.degree || 'Degree'}</h5>
                        <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                          {edu?.institution || 'Institution'}<br />
                          {edu?.year || 'Year'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {profile.graduation?.degree && (
                  <div style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                    <h4 style={{ margin: '0 0 6px', color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>Graduation</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                      {profile.graduation.degree || 'Degree'} in {profile.graduation.stream || 'Stream'}<br />
                      {profile.graduation.college || 'College Name'}<br />
                      {profile.graduation.startYear || 'Start Year'} - {profile.graduation.endYear || 'End Year'}
                    </p>
                  </div>
                )}

                {profile.secondaryeducation && Object.keys(profile.secondaryeducation).length > 0 && (
                  <div style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                    <h4 style={{ margin: '0 0 6px', color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>Secondary Education (XII)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                      Board: {profile.secondaryeducation.board || 'N/A'}<br />
                      Year: {profile.secondaryeducation.year || 'N/A'}
                    </p>
                  </div>
                )}

                {profile.diploma && Object.keys(profile.diploma).length > 0 && (
                  <div style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                    <h4 style={{ margin: '0 0 6px', color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>Diploma</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                      Stream: {profile.diploma.stream || 'Stream'}<br />
                      {profile.diploma.college || ''}<br />
                      {profile.diploma.startYear || 'Start Year'} - {profile.diploma.endYear || 'End Year'}
                    </p>
                  </div>
                )}

                {profile.phd && Object.keys(profile.phd).length > 0 && (
                  <div style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                    <h4 style={{ margin: '0 0 6px', color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>Ph.D</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                      Stream: {profile.phd.stream || 'Stream'}<br />
                      {profile.phd.college || ''}<br />
                      {profile.phd.startYear || 'Start Year'} - {profile.phd.endYear || 'End Year'}
                    </p>
                  </div>
                )}
              </div>

              <AddSkill profile={profile} setProfile={(u) => setProfile(prev => normalizeCandidate(typeof u === 'function' ? u(prev) : u))} />

              <div className="input-block">
                <label>Experience:</label>
                <div className="experience-buttons">
                  <button onClick={() => setShowJobModal(true)}>+ Add Jobs</button>
                  <button onClick={() => alert('Open Add Internships Modal')}>+ Add Internships</button>
                </div>
              </div>

              {Array.isArray(profile.jobs) && profile.jobs.length > 0 && (
                <div className="job-list">
                  {profile.jobs.map((job, index) => (
                    <div key={index} className="job-card">
                      <h4>{job.designation} at {job.organization}</h4>
                      <p>{job.startDate} to {job.currentlyWorking ? 'Present' : job.endDate}</p>
                      {job.description && <p>{job.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              <div className="input-block">
                <label>Career Objective:</label>
                <textarea name="careerObjective" value={profile.careerObjective} onClick={() => setShowObjectiveModal(true)} readOnly rows={3} placeholder="Write your career objective here..." className="limited-textarea" />
              </div>

              <div className="input-block">
                <label>Extra Curricular Activities:</label>
                <textarea name="extraCurricular" value={profile.extraCurricular} onClick={() => setShowExtraCurricularModal(true)} readOnly rows={3} placeholder="Mention any extracurricular activities..." className="limited-textarea" />
              </div>

              {/* Trainings Section */}
              <div className="input-block">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Trainings / Courses:</span>
                  <button type="button" onClick={() => setShowTrainingModal(true)} style={{ background: '#00aaff', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    + Add Training / Course
                  </button>
                </label>

                {(!Array.isArray(profile.trainingsCourses) || profile.trainingsCourses.length === 0) ? (
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>No trainings or courses added yet.</p>
                ) : (
                  profile.trainingsCourses.map((training, i) => (
                    <div key={i} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px', marginTop: '8px', background: '#f9f9f9' }}>
                      <strong>{training.trainingProgram}</strong> at {training.organization} {training.currentlyOngoing ? '(Ongoing)' : ''}
                      <br />
                      {training.startDate} - {training.currentlyOngoing ? 'Present' : training.endDate}
                      <br />
                      {training.location && <em>{training.location}</em>}
                      {training.description && <p style={{ marginTop: '4px' }}>{training.description}</p>}
                    </div>
                  ))
                )}
              </div>

              {/* Projects */}
              <div className="input-block">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Academic / Personal Projects:</span>
                  <button type="button" onClick={() => setShowProjectModal(true)} style={{ background: '#00aaff', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    + Add Project
                  </button>
                </label>

                {(!Array.isArray(profile.academicProjects) || profile.academicProjects.length === 0) ? (
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>No academic or personal projects added yet.</p>
                ) : (
                  profile.academicProjects.map((project, i) => (
                    <div key={i} style={{ marginTop: '12px', border: '1px solid #ddd', borderRadius: '8px', padding: '12px 16px',backgroundColor: '#f9fcff',boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <strong style={{fontSize:'16px',fontWeight:'bold',color:'#222',display:'block',marginBottom:'6px'}}>{project.title}</strong>
                      <p style={{ margin: '4px 0', color: '#555', fontSize: '14px',  fontStyle: 'italic' }}>{project.startMonth} - {project.endMonth}</p>
                      {project.description && <p style={{ fontSize: '14px', marginBottom: '6px',color:'#333',lineHeight:'1.5' }}>{project.description}</p>}
                      {project.projectLink && <a 
  href={project.projectLink} 
  target="_blank" 
  rel="noopener noreferrer" 
  style={{ 
    fontSize: '14px', 
    color: '#007bff', 
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer' 
  }}
  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
>
  🔗 View Project
</a>
}
                    </div>
                  ))
                )}
              </div>

              {/* Portfolio / Work Samples */}
              <div className="input-block">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span>Portfolio / Work Samples:</span>
                  <button type="button" onClick={() => setShowSampleModal(true)} style={{ backgroundColor: '#00aaff', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
                    + Add Sample
                  </button>
                </label>

                {Array.isArray(profile.portfolioSamples) && profile.portfolioSamples.length > 0 && (
                  <div style={{ backgroundColor: '#f4f8fc', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                    <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Portfolio Samples</h4>
                    <ul style={{ paddingLeft: '20px' }}>
                      {profile.portfolioSamples.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                          <strong style={{ color: 'black' }}>{s.title || `Sample ${idx + 1}`}</strong>
                          {s.link && (<> : <a href={s.link} target="_blank" rel="noopener noreferrer">{s.link}</a></>)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bottom-section">
                <div className="resume-section">
                  <label>
                    Upload Resume <span className="note">(PDF only)</span>
                    <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="upload-input" />
                  </label>
                  {profile.resume && <p className="filename">Selected: {profile.resume}</p>}
                </div>

                <button type="button" className="save-button" onClick={saveProfile} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Save Profile'}
                </button>

                {isUploading && <div style={{ marginTop: '10px' }}><progress /></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <EducationPopup
          onClose={() => setShowModal(false)}
          onAddGraduation={() => handleAddEducation('graduation')}
          onAddSecondary={() => handleAddEducation('secondary')}
          onAddDiploma={() => handleAddEducation('diploma')}
          onAddPhD={() => handleAddEducation('phd')}
        />
      )}

      {showGraduationModal && <GraduationModal onClose={() => setShowGraduationModal(false)} profile={profile} setProfile={setProfile} />}
      {showSecondaryEducation && <SecondaryEducationForm onClose={() => setShowSecondaryEducation(false)} profile={profile} setProfile={setProfile} />}
      {showDiplomaDetails && <DiplomaDetails onClose={() => setShowDiplomaDetails(false)} profile={profile} setProfile={setProfile} />}
      {showPhdDetails && <PhdDetails onClose={() => setShowPhdDetails(false)} profile={profile} setProfile={setProfile} />}
      {showJobModal && <AddJobModal onClose={() => setShowJobModal(false)} onSave={handleJobSave} />}
      {showTrainingModal && <TrainingDetailsModal onClose={() => setShowTrainingModal(false)} onSave={(data) => setProfile(prev => ({ ...prev, trainingsCourses: [...arr(prev.trainingsCourses), data] }))} />}
      {showProjectModal && <ProjectDetailsModal onClose={() => setShowProjectModal(false)} onSave={(data) => setProfile(prev => ({ ...prev, academicProjects: [...arr(prev.academicProjects), data] }))} />}

      {showObjectiveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Career Objective</h3>
            <textarea rows="8" value={profile.careerObjective} maxLength={2000} onChange={(e) => setProfile(prev => ({ ...prev, careerObjective: e.target.value }))} className="limited-textarea" placeholder="Write your objective (max 2000 characters)..." />
            <div className="char-counter">{(profile.careerObjective || '').length}/2000 characters</div>
            <div className="modal-actions">
              <button onClick={() => setShowObjectiveModal(false)}>Save</button>
              <button onClick={() => setShowObjectiveModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showExtraCurricularModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Extra Curricular Activities</h3>
            <textarea rows="8" value={profile.extraCurricular} maxLength={2000} onChange={(e) => setProfile(prev => ({ ...prev, extraCurricular: e.target.value }))} className="limited-textarea" placeholder="Mention any extracurricular activities..." />
            <div className="char-counter">{(profile.extraCurricular || '').length}/2000 characters</div>
            <div className="modal-actions">
              <button onClick={() => setShowExtraCurricularModal(false)}>Save</button>
              <button onClick={() => setShowExtraCurricularModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSampleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Your Sample</h3>
            <input type="text" placeholder="Title" value={sample.title} onChange={(e) => setSample(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', marginBottom: '10px' }} />
            <input type="text" placeholder="Link" value={sample.link} onChange={(e) => setSample(prev => ({ ...prev, link: e.target.value }))} style={{ width: '100%', marginBottom: '10px' }} />
            <div className="modal-actions">
              <button onClick={handleAddSample}>Save</button>
              <button onClick={() => setShowSampleModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateProfile;
