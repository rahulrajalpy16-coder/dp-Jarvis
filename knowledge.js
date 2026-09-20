// DP JARVIS Knowledge Base Module
(function(root) {
  var DP_KNOWLEDGE = {
  "knowledge_base_meta": {
    "name": "Jarvis DP Marine Knowledge Base",
    "version": "1.0.0",
    "author": "Dynamic Positioning Expert Systems Group",
    "target_audience": "DP Operators (DPOs), Marine Engineers, ETOs, Marine Superintendents, FMEA Practitioners",
    "description": "Production-grade domain ontology and diagnostic expert database for DP-2 and DP-3 vessels covering controller architectures, position reference systems, environmental sensors, operational guidelines, failure mode mitigation, and real-world emergency troubleshooting."
  },
  "systems": {
    "kongsberg_maritime": {
      "name": "Kongsberg Maritime K-Pos & SDP Series",
      "models": [
        "K-Pos DP-11 / DP-12",
        "K-Pos DP-21 / DP-22 (DP-2)",
        "K-Pos DP-31 / DP-32 (DP-3)",
        "SDP 11 / 21 / 31 (Legacy)"
      ],
      "description": "Industry-standard dynamic positioning system utilizing high-integrity dual or triple redundant distributed controller hardware (RBUS and cMotion architectures) and Kalman filtering algorithms for vessel motion prediction and thruster allocation.",
      "controller_architecture": {
        "redundancy_configurations": {
          "DP-2": "Dual redundant processing units (Controller A and Controller B) operating in master/hot-standby with seamless bumpless transfer. Synchronized state vectors updated cycle-by-cycle (typically 100ms cycle).",
          "DP-3": "Triple processing units (Controller A, B, and C) where Controller C is physically separated in an A-60 fire and watertight backup control compartment with an isolated independent backup operator station (BOS)."
        },
        "network_architecture": {
          "topology": "Dual redundant switched Ethernet process bus (Net A and Net B) utilizing proprietary Kongsberg communication protocols with deterministic packet scheduling.",
          "field_interfaces": "Remote I/O units (RIO), Field Stations (FS100/FS200), and cMotion I/O modules connected over isolated dual CAN-bus or RBUS industrial multidrop serial loops.",
          "isolation": "Galvanically isolated optocoupler inputs, dual 24V DC auxiliary power rails fed by dedicated uninterrupted power supplies (UPS A and UPS B)."
        },
        "voting_logic": {
          "sensor_rejection": "Median evaluation and variance-based statistical quality testing (Kalman filter innovation testing). If a sensor deviates beyond 3 standard deviations (3-sigma) from model prediction, it is flagged as rejected.",
          "reference_rejection": "Position reference system (PRS) weighting based on calculated variance (Kalman residual error). Requires minimum 3 PRS for automatic majority voting; in dual PRS configurations, divergence triggers operator warning without automatic rejection of valid PRS unless covariance exceeds hard threshold."
        },
        "operating_modes": [
          {
            "name": "Auto DP (Station Keeping)",
            "description": "Full three degrees-of-freedom (Surge, Sway, Yaw) automated positioning using selected reference systems, gyrocompasses, and thruster allocation algorithms."
          },
          {
            "name": "Joystick (Manual / Auto Heading)",
            "description": "Manual vector thruster control via 3-axis joystick with automatic yaw/heading maintenance locked onto gyrocompass reference."
          },
          {
            "name": "Auto Track (Low Speed / High Speed)",
            "description": "Follows pre-defined waypoints with controlled speed over ground and fixed or tangent heading for pipelay, cable lay, or trenching operations."
          },
          {
            "name": "Weather Vane (Minimum Thrust)",
            "description": "Rotates vessel bow into the resultant environmental force (wind, wave drift, current) to minimize total thruster power consumption, critical for FPSOs and shuttle tankers."
          }
        ],
        "specific_failure_diagnostics": {
          "controller_stall_watchdog": "Hardware watchdog timer trips within 200ms if cycle execution freezes, releasing the fail-safe relay and forcing immediate bumpless transfer to the standby controller.",
          "dual_net_failure": "If Net A fails, Net B carries process data with immediate 'Net A Communication Failure' alarm. If both nets fail, field stations enter fail-safe condition (freezing last valid thruster command or zero-pitching based on class configuration).",
          "io_cabinet_faults": "Module fault LEDs indicate RIO communication loss, blown 24V loop fuse, or field transmitter loop open/short circuit."
        }
      }
    },
    "marine_technologies": {
      "name": "Marine Technologies (MT) Bridge Mate DP Series",
      "models": [
        "Bridge Mate DP-1",
        "Bridge Mate DP-2",
        "Bridge Mate DP-3"
      ],
      "description": "High-reliability DP control system utilizing multi-master distributed computing topology, commercial off-the-shelf (COTS) industrial computers running real-time operating systems, and dedicated touch-screen operator terminals.",
      "controller_architecture": {
        "redundancy_configurations": {
          "DP-2": "Dual redundant Real-Time Controllers (RTC-1 and RTC-2) interconnected via isolated heartbeat lines and dual gigabit fiber/copper networks. Both controllers continuously compute thruster commands; secondary acts in hot-standby.",
          "DP-3": "Triple redundant RTC-1, RTC-2, and RTC-3 with physical segregation of RTC-3 behind A-60 bulkheads, powered by independent battery banks and separate emergency switchboards."
        },
        "network_architecture": {
          "topology": "Dual independent Gigabit Ethernet Ring (Net-1 and Net-2) using Rapid Spanning Tree Protocol (RSTP) or proprietary deterministic token passing for sub-10ms packet recovery.",
          "field_interfaces": "WAGO / Phoenix Contact distributed industrial I/O nodes communicating via Modbus TCP or Profinet over dedicated dual network loops.",
          "power_supply": "Dual redundant diode-decoupled 24V DC supplies fed from separate vessel UPS systems with active voltage monitoring and fault telemetry."
        },
        "voting_logic": {
          "sensor_rejection": "Weighted average voting algorithm comparing sensor input delta against predicted vessel trajectory. Any sensor exceeding user-set or automated innovation limits is de-weighted and tagged 'UNHEALTHY'.",
          "reference_rejection": "Absolute and relative distance gating. If a position reference drifts by more than the configurable gate limit (typically 1.5m - 3.0m depending on water depth) relative to the estimated position, the PRS is rejected with audible alarm."
        },
        "operating_modes": [
          {
            "name": "Auto Pos (Position & Heading)",
            "description": "Automated surge, sway, and heading control relative to global coordinates or target vessel."
          },
          {
            "name": "Target Tracking / Follow Target",
            "description": "Maintains position and heading relative to a moving surface transponder (e.g., ROV, pipe lay barge, or crane vessel)."
          },
          {
            "name": "Independent Joystick System (IJS)",
            "description": "Independent Class-approved joystick backup completely separate from main DP controllers, wired directly to thruster interface cabinets."
          },
          {
            "name": "Autopilot / Transit Mode",
            "description": "High-speed course-keeping mode driving main rudders and azimuth thrusters for passage navigation."
          }
        ],
        "specific_failure_diagnostics": {
          "rtc_divergence_alarm": "Generated when computed thrust allocations between RTC-1 and RTC-2 differ by more than 5% for more than 3 consecutive calculation cycles.",
          "io_comm_timeout": "Triggered when communication to an I/O node drop below refresh cycle threshold (typically 250ms), freezing thruster feedback and annunciating yellow alert.",
          "touch_screen_os_freeze": "Watchdog circuit reboots the operator terminal within 5 seconds without disturbing background real-time controller calculations."
        }
      }
    },
    "navis_engineering": {
      "name": "Navis Engineering NavDP 4000 Series",
      "models": [
        "NavDP 4000 (DP-1)",
        "NavDP 4002 (DP-2)",
        "NavDP 4003 (DP-3)"
      ],
      "description": "Finnish-engineered precision DP system widely deployed on offshore support vessels, megayachts, and icebreakers, known for intuitive graphical user interfaces, advanced mathematical hydrodynamics models, and robust CAN-bus field architecture.",
      "controller_architecture": {
        "redundancy_configurations": {
          "DP-2": "Dual redundant Central Processing Units (Navis DPU-A and DPU-B) with hot-swap capability, synchronized via point-to-point fiber optic inter-controller bus (ICB).",
          "DP-3": "Triple processing units with independent emergency backup control station (NavDP 4000 Backup) equipped with dedicated sensors and isolated power sources."
        },
        "network_architecture": {
          "topology": "Dual isolated Ethernet LANs for operator stations combined with dual redundant CAN-bus networks (CAN-A and CAN-B) for thruster, sensor, and I/O communication.",
          "field_interfaces": "Navis Universal I/O modules (NUIO) with dedicated optoisolators per channel, providing high immunity to marine common-mode electrical noise.",
          "power_supply": "Redundant 24V DC DC-UPS systems with internal lead-acid or lithium-iron-phosphate battery buffers."
        },
        "voting_logic": {
          "sensor_rejection": "Dynamic statistical variance test combined with physical limits check (e.g. rate-of-turn exceedance on gyrocompasses, g-force limit on MRU).",
          "reference_rejection": "Combined weighting matrix assessing dilution of precision (PDOP/HDOP), signal-to-noise ratio, and position residual against mathematical ship model."
        },
        "operating_modes": [
          {
            "name": "Fully Automatic DP",
            "description": "Standard 3-axis position and heading holding with adaptive wave filtering to reduce unnecessary thruster wear."
          },
          {
            "name": "Semi-Auto DP (Manual Position / Auto Heading)",
            "description": "Operator controls vessel position manually with joystick while system maintains heading automatically."
          },
          {
            "name": "Anchor Assisted DP",
            "description": "Integrates multi-point mooring line tension and fairlead angle telemetry into the thruster allocation algorithm to minimize fuel consumption while keeping position on moored rigs."
          },
          {
            "name": "ROV Follow Mode",
            "description": "Maintains vessel position relative to the subsea ROV transponder within an operator-defined offset bubble."
          }
        ],
        "specific_failure_diagnostics": {
          "can_bus_busoff_state": "If a CAN controller enters 'Bus Off' due to high error frame count, the DPU automatically isolates the faulty transceiver and shifts traffic to the redundant CAN bus.",
          "mathematical_model_drift": "When all external position references are lost, the Navis hydro-model provides up to 10-15 minutes of dead reckoning with visual dead-reckoning drift uncertainty ellipses.",
          "thruster_bias_warning": "Identifies uncommanded thruster force or mechanical degradation by analyzing persistent position offset under calm environmental loads."
        }
      }
    }
  },
  "prs_and_sensors": {
    "dgnss_dgps": {
      "name": "Differential Global Navigation Satellite Systems (DGPS / DGNSS)",
      "leading_manufacturers": [
        "Veripos (LD7 / LD8 / Apex / Ultra)",
        "Fugro (Marinestar)",
        "Septentrio"
      ],
      "failure_mechanisms": [
        {
          "issue": "Ionospheric Scintillation",
          "symptoms": "Rapid phase jitter, carrier slip, loss of L1/L2 satellite tracking, sudden drop in visible satellites from >16 to <4, rapid spike in HDOP/PDOP.",
          "root_cause": "Solar solar flares or equatorial plasma bubbles creating electron density irregularities in the ionosphere, particularly acute in tropical and polar latitudes.",
          "troubleshooting": "Switch to multi-constellation GNSS (GPS + GLONASS + Galileo + BeiDou), enable dual-frequency iono-free smoothing, verify dual satellite correction beams (e.g. primary Inmarsat beam and secondary high-elevation backup beam)."
        },
        {
          "issue": "Differential Signal Link Loss (L-Band)",
          "symptoms": "DGNSS reverts to autonomous/standalone mode (accuracy drops from 0.1m to 3-5m), 'Diff Correction Lost' alarm on DP desk.",
          "root_cause": "L-Band satellite line-of-sight shadowed by offshore platform superstructure, derrick, or crane; coaxial cable water ingress or faulty LNB amplifier.",
          "troubleshooting": "Check L-Band signal-to-noise ratio (SNR) on receiver diagnostic screen; verify dual L-Band antennas positioned on opposite sides of vessel mast; inspect RF coaxial connectors for salt corrosion and moisture."
        },
        {
          "issue": "Multipath Interference",
          "symptoms": "Slow position bias or periodic position oscillation of 1m to 4m without loss of satellite lock.",
          "root_cause": "GNSS signals reflecting off oil rig metal bulkheads, water surface, or adjacent crane booms before hitting antenna.",
          "troubleshooting": "Inspect antenna choke-ring status, verify mask angle setting (minimum 10 to 15 degrees above horizon), de-select affected GNSS from DP voting when operating deep inside platform jackets."
        }
      ]
    },
    "cyscan_radascan": {
      "name": "Laser & Microwave Relative Sensors (CyScan / RadaScan)",
      "leading_manufacturers": [
        "Guidance Marine (CyScan Mk4, CyScan AS, RadaScan, RadaScan View)",
        "W\u00e4rtsil\u00e4 Guidance"
      ],
      "failure_mechanisms": [
        {
          "issue": "Prism Target Contamination & Dirty Optics (CyScan)",
          "symptoms": "'Target Signal Low', 'Target Lost', or intermittent target dropouts when vessel pitches or rolls in heavy sea.",
          "root_cause": "Salt spray, soot, grease, or heavy fog coating the optical front window of the sensor head or dirty reflective retro-reflectors/prisms on the platform.",
          "troubleshooting": "Clean CyScan front window using isopropanol and soft optical cloth; cycle the automated lens wiper/wash cycle; inspect target prisms on offshore structure for damage; increase laser sensitivity threshold if permissible."
        },
        {
          "issue": "False Reflections / High-Intensity Clutter (CyScan)",
          "symptoms": "CyScan locks onto false target (crane hook, personnel reflective coveralls, lifebuoy reflective tape), sudden position jump of 5m to 20m.",
          "root_cause": "High-visibility reflective material on offshore structure or vessel deck entering the optical sweep sector with high signal intensity.",
          "troubleshooting": "Configure active blanking sectors in CyScan software to mask out vessel crane and working deck; utilize multi-prism target ID indexing; switch target tracking mode to 'Prism Cluster' with unique geometric fingerprint."
        },
        {
          "issue": "Transponder Battery / Line-of-Sight Loss (RadaScan)",
          "symptoms": "RadaScan reports 'Transponder No Reply' or 'Low Signal Level' while in close proximity to rig.",
          "root_cause": "RadaScan smart responder battery flat (exceeded operating lifespan), transponder antenna misaligned, or physical blockage by supply vessel superstructure.",
          "troubleshooting": "Verify responder battery charge status via telemetric RF link; check line-of-sight angles (ensure within +/- 30 degrees vertical beamwidth); swap to alternate responder channel ID."
        }
      ],
      "service_and_hardware_troubleshooting": {
        "cyscan_motor_rotating_but_no_targets": [
          {
            "component": "Front Optical Window / Glass Cylinder",
            "defect": "Salt crust, diesel soot, oily exhaust film, or condensation on optical aperture.",
            "diagnostic_check": "Inspect glass under torchlight. Verify if laser pulse scatters into a ring or haze.",
            "corrective_action": "Clean optical cylinder with 99% isopropyl alcohol and non-abrasive optical lens wipes. Trigger automated wash/wipe cycle if fitted. Inspect wiper blade rubber."
          },
          {
            "component": "Tilt / Pitch Elevation Mechanism Jammed",
            "defect": "Azimuth rotor motor spins freely, but internal vertical tilt motor or tilt sensor is jammed at maximum elevation (+20\u00b0) or depression (-20\u00b0).",
            "diagnostic_check": "Check CyScan console pitch/tilt status readout. If fixed at maximum angle, laser beam is firing above or below the rig prisms.",
            "corrective_action": "Power cycle sensor head to initiate mechanical home tilt calibration. Inspect internal tilt drive belt, lead screw, and microswitches inside the optical head."
          },
          {
            "component": "Laser Transceiver Diode / Transmitter Board",
            "defect": "Laser diode failed, degraded emission power, or blown 24V transmitter DC-DC converter fuse.",
            "diagnostic_check": "Check diagnostic LED 'TX_LASER' on main processor PCB inside the housing. Use an IR detector card or smartphone camera in night mode to check for faint 905nm flashing.",
            "corrective_action": "If no IR pulse detected while rotor spins, replace Laser Transceiver Unit (LTU) module or check internal fuse F1 on the power rail."
          },
          {
            "component": "Optical Azimuth Encoder / Zero-Index Sensor",
            "defect": "Rotor motor turns, but optical encoder disk or magnetic index sensor has failed or accumulated carbon dust.",
            "diagnostic_check": "Console shows motor running but reports 'Bearing Index Error' or bearing values jump erratically. No targets are confirmed because bearing cannot be referenced.",
            "corrective_action": "Clean encoder optical pick-up head with compressed dry air; check encoder cable harness for pinched conductors."
          },
          {
            "component": "Internal Gold Slip Ring Assembly",
            "defect": "Slip ring contacts worn, causing loss of serial data or laser return signals between rotating head and stationary base unit.",
            "diagnostic_check": "Intermittent communication loss, intermittent target detection only at certain rotation angles.",
            "corrective_action": "Inspect slip ring assembly for copper/carbon dust. Measure continuity across rotating contacts; replace slip ring capsule if noise exceeds 20 milliohms."
          },
          {
            "component": "Target / Blanking Sector Configuration",
            "defect": "Software blanking sector active across target bearing, or target prism obscured by crane, scaffolding, or personnel.",
            "diagnostic_check": "Check CyScan software 'Blanking Sectors' tab. Confirm rig target is line-of-sight and within vertical aperture window (typically +/- 20\u00b0).",
            "corrective_action": "Adjust blanking zones. Request rig crew check prism orientation and clean prism glass."
          },
          {
            "component": "Serial / NMEA Telemetry & Baud Rate",
            "defect": "Rotor active, but NMEA telegrams ($PPRPS / $PCYS) corrupted or baud rate mismatched (9600 vs 19200 baud).",
            "diagnostic_check": "Connect serial terminal (PuTTY) to RS-422/RS-232 port from sensor. Check for incoming NMEA strings.",
            "corrective_action": "Confirm parity (None), Data Bits (8), Stop Bits (1), Baud Rate (9600/19200). Inspect RS-422 differential transceiver IC (MAX485/SN75176)."
          }
        ]
      }
    },
    "hydroacoustics": {
      "name": "Hydroacoustic Positioning (HiPAP & USBL)",
      "leading_manufacturers": [
        "Kongsberg Maritime (HiPAP 502 / 501 / 351 / 102)",
        "Sonardyne (Marksman / Ranger 2 USBL)"
      ],
      "failure_mechanisms": [
        {
          "issue": "Thruster Acoustic Noise & Aeration",
          "symptoms": "HiPAP transponder position noise increases dramatically (ellipse enlarges), high rate of missing acoustic replies (>30% interrogations dropped).",
          "root_cause": "Bow tunnel thruster cavitation or azimuth thruster slipstream blowing air bubbles directly across the transducer face located on the hull drop keel/gate valve.",
          "troubleshooting": "Lower the acoustic transducer trunk further into clean water (extend drop keel below thruster bubble wash); bias vessel heading to divert thruster wake away from transducer; adjust acoustic receiver filtering bands."
        },
        {
          "issue": "Sound Velocity Profile (SVP) Error",
          "symptoms": "Continuous radial position offset or depth discrepancy that scales with horizontal offset distance from transponder.",
          "root_cause": "Outdated sound speed profile in water column; thermocline layers and salinity gradients bending acoustic ray paths (ray refraction).",
          "troubleshooting": "Deploy CTD / sound velocity profiler (SVP) probe to record current water column sound velocity; upload fresh SVP profile into HiPAP / Sonardyne processor; verify surface sound velocity probe at transducer head is operational."
        },
        {
          "issue": "Transponder Battery Depletion & Reverberation",
          "symptoms": "Subsea transponder replies become intermittent and signal amplitude drops below detection threshold.",
          "root_cause": "Transponder internal lithium battery depleted, or excessive multi-path acoustic reverberation in shallow water between seabed and vessel steel hull.",
          "troubleshooting": "Switch transponder to low-power or wideband acoustic telemetry (e.g. Kongsberg Cymbal or Sonardyne Wideband 2 protocol); deploy backup transponder; reduce interrogation ping frequency to allow acoustic reflections to decay."
        }
      ]
    },
    "artemis_and_taut_wire": {
      "name": "Microwave Tracking (Artemis) & Mechanical Taut Wire",
      "leading_manufacturers": [
        "Bandak (Light Taut Wire LTW500)",
        "IMENCO",
        "CHELTON / Artemis Mk5 / Mk6"
      ],
      "failure_mechanisms": [
        {
          "issue": "Artemis Antenna Tracking Unlock (Unlock Alarm)",
          "symptoms": "Artemis audio alarm 'Tracking Lost / Unlocked', antenna continuously rotates searching for mobile/fixed station, freeze of position coordinates.",
          "root_cause": "Physical microwave line-of-sight broken by vessel crane movements, helicopter operations, or radar mast interference; servo motor tracking clutch slipping.",
          "troubleshooting": "Verify optical line-of-sight to fixed station; check antenna RF diplexer and horn dry air desiccant cartridge; perform manual search sweep across known target bearing; check microwave frequency pair (Channel matching)."
        },
        {
          "issue": "Taut Wire Weight Dragging on Seabed",
          "symptoms": "Slow constant drift of taut wire position without tension change, followed by abrupt wire angle spikes.",
          "root_cause": "Clump weight insufficient for soft mud seabed, excessive vessel excursion dragging weight, or subsea cross-current exceeding anchor holding power.",
          "troubleshooting": "Check wire angle telemetry (ensure < 10 degrees from vertical); monitor hydraulic wire tensioner load cell; initiate boom recovery to lift clump weight and re-establish bottom anchor point in firm seabed."
        },
        {
          "issue": "Taut Wire Inclinometer Gimbal Failure",
          "symptoms": "Erratic X/Y angle readings, 'Inclinometer Out of Range' or physical binding of gimbal head.",
          "root_cause": "Potentiometer/resolver failure, mechanical bearing corrosion, or damaged sensor cable on the A-frame gimbal head.",
          "troubleshooting": "Calibrate zero-point angle; test sensor potentiometer resistance across travel span; verify heater operation in freezing conditions to prevent ice locking."
        }
      ]
    },
    "gyrocompasses_and_mrus": {
      "name": "Heading (Gyrocompass) & Motion Reference Units (MRU / VRU)",
      "leading_manufacturers": [
        "Sperry Marine (Navigat 2200 / 3000)",
        "Yokogawa",
        "Teledyne TSS",
        "Kongsberg Seatex (MRU 5 / 5+)",
        "IXBLUE / Exail (Octans / Phins)"
      ],
      "failure_mechanisms": [
        {
          "issue": "Gyrocompass Drift & 2-out-of-3 Rejection",
          "symptoms": "'Gyro Difference Alarm' on DP desk; DP rejected one gyro, two remaining gyros show slow 1.5 - 3.0 deg/min divergent drift.",
          "root_cause": "Fibre-optic gyro (FOG) laser diode degradation, spinning-mass gyro motor bearing wear, or latitude/speed settling error.",
          "troubleshooting": "Compare all 3 gyros against magnetic compass / GNSS satellite compass (true heading); verify NMEA 0183 / IEC 61162 serial baud rate and checksum validity; verify speed/latitude damping input feeds are active."
        },
        {
          "issue": "MRU Roll / Pitch Acceleration Spikes",
          "symptoms": "Sudden violent thrust command surges without actual vessel movement; rapid position rejection spikes on hydroacoustic and laser sensors.",
          "root_cause": "MRU accelerometer saturated by local hull high-frequency vibration (e.g. auxiliary generator exhaust vibration or structural resonance), or ground loop on 4-20mA / serial cable.",
          "troubleshooting": "Check MRU vibration dampening mounting isolators; review sensor signal noise spectra on DP engineering diagnostic page; replace damaged shielded twisted pair wiring; switch DP system to secondary MRU."
        }
      ]
    },
    "wind_sensors": {
      "name": "Ultrasonic & Mechanical Anemometers",
      "leading_manufacturers": [
        "Gill Instruments (WindObserver)",
        "Vaisala",
        "Young"
      ],
      "failure_mechanisms": [
        {
          "issue": "Superstructure Wind Shadow / Downwash Effect",
          "symptoms": "Significant discrepancy between Wind Sensor 1 and Wind Sensor 2 (>10 knots or >30 degrees direction difference).",
          "root_cause": "Vessel heading relative to wind places one anemometer directly in the aerodynamic wake/shadow of the bridge superstructure, crane pedestal, or derrick.",
          "troubleshooting": "Confirm sensor alignment against visual sea state indicators; select the upwind sensor as the active feedforward source in DP; adjust sensor height or relocate out of turbulent shear layer."
        },
        {
          "issue": "Ultrasonic Transducer Ice / Bird Interference",
          "symptoms": "'Wind Sensor Signal Invalid', wind speed locked at 0.0 knots or jumping between extreme values.",
          "root_cause": "Ice accretion across ultrasonic acoustic gap, failed sensor internal de-icing heating element, or physical obstruction across sound path.",
          "troubleshooting": "Inspect 24V heating supply circuit to anemometer; clean ultrasonic transducer mirror surfaces; verify sensor internal diagnostic LED code."
        }
      ]
    }
  },
  "fault_scenarios": [
    {
      "id": "DP-SCEN-001",
      "title": "Thruster Full-Pitch / Max RPM Runaway (Drive-Off Threat)",
      "keywords": [
        "thruster runaway",
        "drive off",
        "pitch feedback failure",
        "servo valve stuck",
        "uncommanded thrust"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 3012 THRUSTER 3 CONTROL LOOP ERROR",
          "MT: ALM_THR3_CMD_FB_DIFF",
          "Navis: THR3 RUNAWAY DETECTED"
        ],
        "alarm_text": "Thruster 3 Pitch Feedback Discrepancy > 15%, Thruster 3 High Current, Position Excursion Increasing.",
        "visual_indications": "DP console shows Thruster 3 command at 10% but feedback at 100%; vessel begins driving off location against environmental resultant."
      },
      "immediate_safety_action": {
        "asog_status": "RED - Immediate Emergency Abort",
        "bridge_action": "Sound DP warning alert on bridge; inform Master and Engine Room immediately; notify subsea / crane / dive / gangway supervisor of imminent station-keeping loss.",
        "thruster_mode": "Hit Thruster 3 Emergency Stop button immediately on the manual thruster backup panel (independent of DP software). Do NOT waste time attempting to troubleshoot in DP software.",
        "safety_zone_advisory": "If within 500m zone of platform, evaluate distance and initiate emergency disconnect / tension release on operational lines."
      },
      "root_cause_analysis": [
        "Electro-hydraulic servo valve spool stuck mechanically due to hydraulic oil contamination or particulate varnish.",
        "Analog pitch control 4-20mA loop cable severed or shorted, causing output amplifier to drift to maximum rail voltage (+10V or 20mA).",
        "Linear Variable Differential Transformer (LVDT) feedback linkage snapped, presenting 0% feedback to local drive controller while driver ramps output to 100% trying to satisfy command."
      ],
      "troubleshooting_steps": [
        "Verify electrical emergency stop circuit disconnected main drive breaker or tripped hydraulic pump motor.",
        "Inspect local thruster hydraulic power pack (HPP) system pressure and pilot valve solenoids.",
        "Check LVDT physical feedback linkage inside thruster steering/pitch room for mechanical separation.",
        "Measure 4-20mA current loop at DP I/O terminal board using calibrated multimeter.",
        "Take hydraulic oil sample for particle count (ISO 4406 cleanliness class)."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 4.3 Thruster Failure Modes",
          "reference_text": "A thruster runaway is considered one of the most severe DP failure modes. Immediate independent emergency stopping facilities must be located within easy reach of the DPO."
        },
        {
          "source_doc": "MTS TECHOP ODP 04",
          "section_or_chapter": "Chapter 2 - Thruster Reliability and Drive Off",
          "reference_text": "Worst Case Failure Design Intent (WCFDI) must analyze runaway thrust and prove that remaining available thrusters can counteract or that shutdown occurs prior to position loss."
        }
      ]
    },
    {
      "id": "DP-SCEN-002",
      "title": "Total Loss of All Position Reference Systems (Dead Reckoning Drift)",
      "keywords": [
        "loss of all prs",
        "dead reckoning",
        "prs reject",
        "station keeping failure",
        "drift off"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1001 ALL POSITION REFERENCES REJECTED",
          "MT: ALM_PRS_ALL_FAILED",
          "Navis: NAV_DP_MODEL_DEAD_RECKONING"
        ],
        "alarm_text": "System Entered Mathematical Model Dead Reckoning Mode; Position Prediction Uncertainty Exceeds Class Limits.",
        "visual_indications": "Position reference indicators turn flashing red; DP model position uncertainty ellipse expands rapidly on DP screen; DGNSS, CyScan, and HiPAP indicators show rejected."
      },
      "immediate_safety_action": {
        "asog_status": "RED - Emergency Operational Abort",
        "bridge_action": "Inform Bridge Team, Engine Room, Client Representative, and Offshore Installation Manager (OIM); halt cargo operations, crane lifting, or diving operations immediately.",
        "thruster_mode": "Monitor mathematical model drift (usually reliable for 5-10 minutes in calm sea, less in heavy sea). Prepare for manual joystick heading hold or manual station recovery if model diverges.",
        "safety_zone_advisory": "If vessel is on the blowing-on side of the installation, execute emergency egress maneuver to safe open water immediately."
      },
      "root_cause_analysis": [
        "Common-mode GNSS satellite blockage or regional RF spoofing/jamming.",
        "Simultaneous optical line-of-sight obstruction on relative sensor (CyScan) combined with deep acoustic aeration on HiPAP.",
        "Serial communication gateway or NMEA network switch lockup feeding serial data to DP controller rack."
      ],
      "troubleshooting_steps": [
        "Check whether physical sensor hardware has failed or if DP system rejection thresholds were triggered by sudden movement.",
        "Inspect raw NMEA string telemetry on DP sensor interface diagnostic page to verify incoming telegrams ($GPGGA, $GPRMC, $PSYN).",
        "Attempt re-enabling DGNSS 1 or relative sensor manually if raw coordinates confirm vessel is stable.",
        "Cycle power to frozen serial-to-Ethernet NMEA multiplexers if all PRS data streams stopped updating simultaneously."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.4 Position Reference Systems",
          "reference_text": "For DP-2/3 operations, at least three independent position reference systems based on at least two different physical principles must be operational and active."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 6.2 Reference Systems Redundancy",
          "reference_text": "The DP mathematical model can provide short-term dead reckoning, but operational limits must require transitioning to a safe state prior to model decay."
        }
      ]
    },
    {
      "id": "DP-SCEN-003",
      "title": "Severe Equatorial Ionospheric Scintillation Impacting DGNSS",
      "keywords": [
        "ionospheric scintillation",
        "solar flare",
        "dgps carrier loss",
        "gnss degradation",
        "pdop spike"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1104 DGPS 1 QUALITY DEGRADED",
          "MT: ALM_GNSS_PDOP_HIGH",
          "Navis: PRS1_VARIANCE_WARNING"
        ],
        "alarm_text": "DGPS 1 & DGPS 2 Carrier Phase Lock Lost; Number of Satellites Dropped Below 4; HDOP > 4.5.",
        "visual_indications": "DGNSS error ellipses expand; position jumps of 3 to 8 meters recorded on both GNSS receivers; differential corrections expire."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Status",
        "bridge_action": "Inform offshore team that DGNSS redundancy is degraded; ensure relative reference systems (CyScan, RadaScan, HiPAP, Taut Wire) are selected and healthy.",
        "thruster_mode": "Maintain Auto DP using relative position references; de-select affected DGNSS units if DP voting logic has not automatically rejected them.",
        "safety_zone_advisory": "Suspend non-critical operations inside 500m zone until satellite constellation stabilizes."
      },
      "root_cause_analysis": [
        "Post-sunset equatorial ionospheric plasma bubbles or intense geomagnetic solar storm creating rapid fluctuations in electron density.",
        "Scintillation induces deep RF signal fading (>20 dB) and rapid phase changes exceeding GNSS receiver carrier tracking loop bandwidth."
      ],
      "troubleshooting_steps": [
        "Check space weather / geomagnetic indices (Kp index) via satellite communication terminal.",
        "Inspect receiver tracking status: enable secondary satellite constellations (Galileo, BeiDou, GLONASS) if receiver is multi-constellation capable.",
        "Switch correction source from standard L-Band to dual-frequency PPP (Precise Point Positioning) with multi-frequency ionosphere-free combinations.",
        "Verify that relative PRS systems (e.g. CyScan, Taut Wire) maintain adequate weight to anchor the DP mathematical filter."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 220",
          "section_or_chapter": "Station Keeping Incident Report Review - GNSS",
          "reference_text": "Ionospheric scintillation accounts for a significant portion of GNSS dual-rejection events in equatorial waters. Vessels must maintain diverse physical reference types."
        },
        {
          "source_doc": "MTS TECHOP ODP 08",
          "section_or_chapter": "Section 4.1 Position Reference System Selection",
          "reference_text": "DGNSS receivers should not be considered mutually independent position references if both are vulnerable to the same ionospheric atmospheric disturbance."
        }
      ]
    },
    {
      "id": "DP-SCEN-004",
      "title": "Gyrocompass Divergence & 2-out-of-3 Voting Failure",
      "keywords": [
        "gyro divergence",
        "heading drift",
        "2 out of 3 voting",
        "yaw instability",
        "gyro fail"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 2003 GYRO 1/GYRO 2 DIFFERENCE HIGH",
          "MT: ALM_HDG_SENSOR_DISAGREE",
          "Navis: GYRO_VOTING_UNCERTAIN"
        ],
        "alarm_text": "Gyro Heading Difference > 2.5 deg; System Unable to Determine Failed Unit Automatically.",
        "visual_indications": "DP displays two conflicting heading values; thrusters start hunting in yaw as the controller tries to hold an ambiguous heading average."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW (or RED if yaw oscillation exceeds 3 degrees)",
        "bridge_action": "Inform Bridge Team; assign dedicated DPO to visual heading monitoring.",
        "thruster_mode": "DPO must immediately cross-check with magnetic compass, GNSS satellite compass, and visual horizon landmarks to identify the true heading. Manually de-select the drifting gyro.",
        "safety_zone_advisory": "Hold station; do not initiate heading changes until faulty gyro is isolated."
      },
      "root_cause_analysis": [
        "Mechanical gimbal motor or ball bearing failure in spinning-mass gyrocompass.",
        "Loss of speed/latitude correction telemetry to one gyro, causing latitude-dependent settling drift error.",
        "Optical laser diode phase degradation in Fibre Optic Gyro (FOG) sensor unit."
      ],
      "troubleshooting_steps": [
        "Compare Gyro 1, Gyro 2, and Gyro 3 readings against standard magnetic compass reading corrected for deviation and variation.",
        "Check auxiliary GNSS satellite compass (e.g., Furuno SC series) true heading output.",
        "Inspect gyro master distribution unit for error codes, power supply ripples, or lost NMEA speed/latitude telegrams.",
        "Confirm that the DP system has locked heading reference onto the verified correct gyrocompass."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.5 Heading Reference Sensors",
          "reference_text": "Three gyrocompasses are required for DP-2 and DP-3 vessels to allow automated 2-out-of-3 voting logic to reject a faulty unit without operator intervention."
        },
        {
          "source_doc": "MTS TECHOP ODP 05",
          "section_or_chapter": "Sensor Selection & Fault Tolerance",
          "reference_text": "When two gyros diverge and third is missing or unstable, the DP control system cannot determine the rogue unit and will alert the DPO to intervene manually."
        }
      ]
    },
    {
      "id": "DP-SCEN-005",
      "title": "High-Voltage Bus-Tie Breaker Inadvertent Open Under Heavy DP Load",
      "keywords": [
        "bus tie open",
        "switchboard split",
        "pms failure",
        "generator overload",
        "camo violation"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 4005 POWER SYSTEM SEPARATION",
          "MT: ALM_PMS_BUSTIE_OPEN",
          "Navis: SWBD_SPLIT_EVENT"
        ],
        "alarm_text": "Main HV Bus-Tie 1 Opened; Power System Split into Autonomous Islands; Thrusters De-rated.",
        "visual_indications": "Switchboard mimic on DP console shows tie breaker open; thrusters 1 & 2 fed by Bus A, thrusters 3 & 4 fed by Bus B; power available bar graphs split."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Power Redundancy",
        "bridge_action": "Contact Engine Control Room (ECR) via direct phone; verify generator status on both switchboards; confirm spinning reserve.",
        "thruster_mode": "Maintain Auto DP; do NOT attempt to reclose bus-tie from DP desk without ECR authorization and synchronization check.",
        "safety_zone_advisory": "Assess whether remaining thruster capacity on each isolated bus section satisfies ASOG post-worst-case failure capability."
      },
      "root_cause_analysis": [
        "Protective relay overcurrent/earth fault trip or spurious differential current detection.",
        "Power Management System (PMS) communication loop failure across switchboard sections.",
        "Inadvertent physical activation of manual trip button or 24V DC control power interruption to breaker trip coil."
      ],
      "troubleshooting_steps": [
        "Verify with Chief Engineer whether trip was caused by actual electrical fault (busbar short circuit) or PMS false command.",
        "Check protection relay event logs (e.g. Woodward / ABB / Siemens protection relays) for trip flags: ANSI 50/51 (Overcurrent), 87 (Differential), 59 (Overvoltage).",
        "Ensure both isolated busbars have active online generators and automatic voltage regulators (AVRs) operating stably.",
        "If fault is cleared and authorized, perform manual synchronization and reclose bus-tie in accordance with vessel DP operating manual."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 3.2 Electrical Power Systems",
          "reference_text": "Where vessels operate in closed bus-tie configuration, the FMEA must demonstrate that no single fault will propagate across the bus-tie or cause loss of both switchboard sections."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 4.5 Advanced Protection Systems",
          "reference_text": "Protection systems across bus-ties must have directional overcurrent, fast bus-strip, and cross-tie isolation features verified by live fault ride-through trials."
        }
      ]
    },
    {
      "id": "DP-SCEN-006",
      "title": "CyScan Laser False Reflection & Target Lock Jumps",
      "keywords": [
        "cyscan false lock",
        "laser target jump",
        "retro-reflector error",
        "high visibility vest",
        "prism drop"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1202 CYSCAN TARGET DISAGREEMENT",
          "MT: ALM_CYSCAN_POS_JUMP",
          "Navis: REL_PRS_EXCURSION"
        ],
        "alarm_text": "CyScan Position Residual Exceeds Gate Limit; Target Identity Mismatch.",
        "visual_indications": "CyScan raw position jumps by 12 meters instantly; tracking indicator shifts from designated prism to deck railing; DP system flags CyScan as 'Suspended' or 'Rejected'."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Position Reference Degraded",
        "bridge_action": "Verify that remaining PRS (DGNSS, RadaScan, or Taut Wire) are holding position solidly; warn deck crew to stay clear of laser line-of-sight.",
        "thruster_mode": "De-select CyScan from the DP active reference list immediately. Ensure DP does not attempt to track the false jump.",
        "safety_zone_advisory": "Maintain safe stand-off distance from offshore structure until sensor tracking is stabilized."
      },
      "root_cause_analysis": [
        "Offshore rig personnel wearing high-visibility retro-reflective PPE walking across crane deck in direct line with CyScan sweep.",
        "Sunlight direct glint or wet steel bulkhead reflection mimicking retro-reflector return intensity.",
        "Incorrect target ID selection in CyScan tracking software."
      ],
      "troubleshooting_steps": [
        "Open CyScan operator console and examine the Raw Reflections Display.",
        "Identify true prism cluster vs false ambient reflection based on reflection intensity and cluster geometry.",
        "Engage 'Blanking Sector' to mask off non-target deck structures and crane work areas.",
        "Re-acquire true target, verify calculated range and bearing match physical radar/visual observations, and re-select into DP."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.4.4 Laser-Based Systems",
          "reference_text": "Laser systems are vulnerable to false target acquisition from retro-reflective tape, wet metal surfaces, and fog. Operators must use target validation protocols."
        },
        {
          "source_doc": "MTS TECHOP ODP 08",
          "section_or_chapter": "Section 5 - Relative Reference System Security",
          "reference_text": "Relative sensors must not be used as sole reference sources during close-proximity offshore operations."
        }
      ]
    },
    {
      "id": "DP-SCEN-007",
      "title": "HiPAP Hydroacoustic Signal Failure Due to Thruster Aeration",
      "keywords": [
        "hipap noise",
        "acoustic aeration",
        "transponder lost",
        "usbl noise",
        "hull cavitation"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1301 HIPAP REPLIES MISSING > 50%",
          "MT: ALM_USBL_SNR_LOW",
          "Navis: HPR_POS_REJECT"
        ],
        "alarm_text": "Hydroacoustic Position Reference Signal-to-Noise Ratio Critical; Acoustic Tracking Lost.",
        "visual_indications": "HiPAP transponder icon turns yellow then red; position standard deviation jumps from 0.2m to 4.5m; acoustic pulse return amplitude degrades."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Reference System",
        "bridge_action": "Notify subsea / ROV / survey team; confirm whether surface DGNSS or relative sensors are taking full position weighting in DP.",
        "thruster_mode": "Alter vessel heading slightly (2 to 5 degrees) into resultant weather to reduce transverse tunnel thruster wash across the acoustic transducer trunk.",
        "safety_zone_advisory": "If performing subsea heavy lift or diver support, suspend operations until acoustic integrity is restored."
      },
      "root_cause_analysis": [
        "High thrust on forward tunnel or retractable azimuth thrusters injecting severe bubble clouds (aeration) directly beneath the hull where the HiPAP transducer is deployed.",
        "Cavitation noise in the 20-30 kHz operating band overwhelming transducer receiver hydrophones.",
        "Transducer gate valve not lowered to full operating extension below the vessel boundary layer."
      ],
      "troubleshooting_steps": [
        "Verify physical deployment depth of the HiPAP transducer trunk (ensure fully lowered to lower limit switch).",
        "Review thruster allocation mimic on DP: check which thruster slipstream is washing toward transducer location.",
        "Inspect acoustic receiver noise spectrum on HiPAP APOS diagnostic window to pinpoint noise frequency peak.",
        "Check subsea transponder battery hours and acoustic telemetry reply code settings."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.4.3 Acoustic Positioning Systems",
          "reference_text": "Transducer heads must be deployed clear of the hull boundary layer and away from thruster wash to avoid acoustic attenuation from air bubbles."
        },
        {
          "source_doc": "Kongsberg HiPAP Technical Manual",
          "section_or_chapter": "Chapter 4 - Operating Precautions and Aeration",
          "reference_text": "Thruster aeration is the primary cause of USBL signal degradation; proper hull penetration depth and heading optimization are required to maintain signal-to-noise ratio."
        }
      ]
    },
    {
      "id": "DP-SCEN-008",
      "title": "Dual Redundant DP Network Switch Broadcast Storm",
      "keywords": [
        "network storm",
        "dual lan failure",
        "switch broadcast storm",
        "controller freeze",
        "ethernet lockup"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 5001 PROCESS NET A FAULT / NET B HIGH LOAD",
          "MT: ALM_NET1_RING_BREAK",
          "Navis: SYSTEM_BUS_ERROR"
        ],
        "alarm_text": "High Network Latency on Process Bus; Inter-Controller Heartbeat Packet Loss.",
        "visual_indications": "Operator station sluggish to touch inputs; field I/O refresh rate stutters; network switch port activity LEDs flashing solidly at 100% duty cycle."
      },
      "immediate_safety_action": {
        "asog_status": "RED - Critical Control Integrity Risk",
        "bridge_action": "Inform Bridge Team and prepare for immediate transfer to Independent Joystick System (IJS) if DP console fails to respond to input commands.",
        "thruster_mode": "Do not attempt aggressive joystick maneuvers. Keep hands on the dedicated Independent Joystick / Emergency Thruster Stop panel.",
        "safety_zone_advisory": "Plan immediate evacuation of 500m zone if control cycle latency exceeds 500ms."
      },
      "root_cause_analysis": [
        "Spanning Tree Protocol (STP/RSTP) loop failure in managed industrial Ethernet switch due to damaged ring cabling or misconfigured bridge priority.",
        "Defective network interface card (NIC) on one of the operator stations babbling packets continuously onto both Net A and Net B.",
        "Unauthorized laptop or third-party diagnostic device connected to the dedicated DP process network."
      ],
      "troubleshooting_steps": [
        "Disconnect any newly connected external diagnostic cables or maintenance laptops immediately.",
        "Isolate operator stations one by one to determine if a specific terminal NIC is flooding the network.",
        "Verify managed switch ring status LEDs (ensure ring coupling / redundancy manager indicates healthy closed ring).",
        "Inspect switch port traffic counters via engineering console to locate the port generating broadcast packets."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 4.1.4 Control Networks and Communications",
          "reference_text": "Data networks linking DP controllers and I/O units must be segregated and protected against broadcast storms and network loops by deterministic hardware."
        },
        {
          "source_doc": "MTS TECHOP ODP 02",
          "section_or_chapter": "Section 3 - Industrial Ethernet in DP Systems",
          "reference_text": "DP control networks must never be connected to vessel administrative LANs or external internet without certified unidirectional data diodes or air-gaps."
        }
      ]
    },
    {
      "id": "DP-SCEN-009",
      "title": "Motion Reference Unit (MRU) Acceleration Spike During Heavy Swell",
      "keywords": [
        "mru spike",
        "vru roll pitch error",
        "antenna compensation failure",
        "kalman filter residual",
        "wave swell"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 2102 MRU 1 ROLL/PITCH ACCEL ERROR",
          "MT: ALM_VRU_OUT_OF_LIMIT",
          "Navis: SENS_MRU_SPIKE"
        ],
        "alarm_text": "MRU 1 Data Rejected by Kalman Filter; Position Sensor Antenna Lever Arm Compensation Degraded.",
        "visual_indications": "DGNSS and CyScan position readings oscillate in phase with vessel roll; DP thrust surges cyclically in sway."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Sensor Redundancy Lost",
        "bridge_action": "Check whether DP system automatically switched to MRU 2; confirm vessel motion limits within safe operating envelope.",
        "thruster_mode": "Auto DP maintained; ensure DP filter is set to 'Rough Sea' or 'High Wave Filter' damping to avoid excessive thruster cycling.",
        "safety_zone_advisory": "Monitor distance to assets closely as roll/pitch induced antenna motion increases position error margins."
      },
      "root_cause_analysis": [
        "Internal MEMS / ring-laser accelerometer drift or saturation inside MRU sensor body under high angular acceleration.",
        "Damaged rubber vibration mount allowing high-frequency engine vibration to induce resonance on MRU sensor casing.",
        "Loss of lever-arm offset calibration values between MRU center of rotation and mast-top GNSS antennas."
      ],
      "troubleshooting_steps": [
        "Compare roll, pitch, and heave readings across MRU 1, MRU 2, and MRU 3.",
        "Inspect physical MRU mounting bracket for loose bolts, structural cracks, or degraded elastomeric dampers.",
        "Check serial telemetry strings ($PSXN, 20 or $PFEC) on DP engineering screen for sensor internal status flags.",
        "Verify that antenna lever arm coordinate matrix (X, Y, Z offsets relative to vessel center of gravity) remains uncorrupted in DP software setup."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.5.2 Motion Reference Sensors",
          "reference_text": "MRU data is critical for lever-arm compensation of GPS antennas and acoustic transducers. Redundant MRUs must be installed and dynamically cross-monitored."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 5.3 Sensor Redundancy",
          "reference_text": "Failure of an MRU must not induce uncommanded position excursions; mathematical filtering must reject high-frequency accelerometer saturation."
        }
      ]
    },
    {
      "id": "DP-SCEN-010",
      "title": "Wind Sensor Relative Shelter Effect Causing False Feedforward Thrust",
      "keywords": [
        "wind sensor shelter",
        "wind feedforward error",
        "anemometer difference",
        "false wind force",
        "crane shelter"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 2201 WIND SENSOR 1/2 DIFFERENCE > 10 KNOTS",
          "MT: ALM_WIND_DISCREPANCY",
          "Navis: SENS_WIND_UNRELIABLE"
        ],
        "alarm_text": "Wind Sensor Reading Discrepancy; Wind Feedforward Force Divergence.",
        "visual_indications": "Wind Sensor 1 shows 35 knots from 045 deg, Wind Sensor 2 shows 12 knots from 090 deg; DP system applies unnecessary counter-thrust, causing vessel position offset."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Sensors",
        "bridge_action": "Visually inspect sea state, whitecaps, and offshore platform flare angle to estimate true ambient wind direction and speed.",
        "thruster_mode": "DPO must immediately select the un-sheltered, upwind sensor on the DP desk and deselect the sheltered downwind sensor.",
        "safety_zone_advisory": "Remain alert for vessel position overshoot when changing vessel heading in relation to large offshore structures."
      },
      "root_cause_analysis": [
        "Vessel heading places Wind Sensor 2 directly into the turbulent aerodynamic wake of a large offshore construction crane or drilling derrick.",
        "Mechanical anemometer bearings failing, or ice formation on anemometer cups while ultrasonic sensor operates correctly."
      ],
      "troubleshooting_steps": [
        "Identify vessel heading relative to ambient wind and nearby superstructures.",
        "Review raw data logs for Wind 1, Wind 2, and Wind 3 (if installed).",
        "Temporarily adjust DP wind feedforward gain if both sensors are subject to complex vortex shedding between two adjacent platform modules.",
        "Inspect sensor heating circuits during sub-zero operational environments."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.5.3 Wind Sensors",
          "reference_text": "At least two wind sensors must be fitted in locations that minimize mutual aerodynamic masking or interference from the vessel superstructure."
        },
        {
          "source_doc": "MTS TECHOP ODP 05",
          "section_or_chapter": "Section 3.2 - Wind Sensor Location and Voting",
          "reference_text": "Wind feedforward provides rapid initial counter-thrust; incorrect wind data will inject erroneous forces directly into the allocation controller."
        }
      ]
    },
    {
      "id": "DP-SCEN-011",
      "title": "Fuel Day-Tank Quick Closing Valve Inadvertent Trip (Multi-Generator Blackout)",
      "keywords": [
        "fuel quick closing valve",
        "multi generator trip",
        "blackout",
        "fuel starvation",
        "common mode failure"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 4101 GENERATOR 1 & 2 FREQUENCY LOW",
          "MT: ALM_PWR_MULTI_GEN_TRIP",
          "Navis: SYSTEM_BLACKOUT_WARNING"
        ],
        "alarm_text": "Emergency Fuel Supply Cutoff Activated; Fuel Header Pressure Dropping Rapidly; Generators Dropping Offline.",
        "visual_indications": "Generator frequency and voltage collapse on Switchboard A; main propulsion thrusters trip on under-frequency; emergency lighting activates."
      },
      "immediate_safety_action": {
        "asog_status": "RED - Catastrophic Emergency",
        "bridge_action": "Sound vessel General Alarm; broadcast Mayday / Pan-Pan depending on proximity to installation; alert Master, ECR, and OIM.",
        "thruster_mode": "If DP-2/3 separation held, verify whether redundant half of power plant (Switchboard B and separate fuel day-tank) remains online. If total blackout, prepare anchor or emergency towing.",
        "safety_zone_advisory": "Initiate immediate emergency evacuation from subsea / platform envelope."
      },
      "root_cause_analysis": [
        "Accidental activation of pneumatic / hydraulic quick-closing valve pull-wire or emergency push-button on bridge or safety station.",
        "Pneumatic air control line leakage in the safety release system causing fail-safe closure of fuel valves.",
        "Common-mode routing of fuel lines violating Class segregation rules."
      ],
      "troubleshooting_steps": [
        "Chief Engineer must immediately inspect pneumatic release cabinet in ECR and release control air pressure.",
        "Manually reset mechanical trip latches on fuel supply day-tank quick closing valves in engine room.",
        "Bleed air from fuel injection manifolds and start standby diesel generator on healthy switchboard section.",
        "Verify blackout recovery automation sequences restore power to auxiliary cooling and lube oil pumps."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 3.4 Fuel Systems and FMEA Independence",
          "reference_text": "The FMEA must prove that inadvertent operation of quick-closing valves cannot cause total loss of all fuel supplies to all redundant generator sets simultaneously."
        },
        {
          "source_doc": "MTS TECHOP ODP 01",
          "section_or_chapter": "Blackout Recovery and Prevention",
          "reference_text": "Vessels must maintain strictly independent fuel day tanks and dedicated isolated fuel supply lines per redundant machinery group."
        }
      ]
    },
    {
      "id": "DP-SCEN-012",
      "title": "DP Uninterruptible Power Supply (UPS) Battery Bank Failure",
      "keywords": [
        "ups failure",
        "dc bus collapse",
        "ups battery trip",
        "controller power lost",
        "static bypass"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 5102 UPS A ON BATTERY / DISCHARGING",
          "MT: ALM_UPS_STATIC_BYPASS",
          "Navis: PWR_UPS_FAULT"
        ],
        "alarm_text": "UPS A Battery Voltage Low; Inverter Fault; DP Controller A Transferred to Static Bypass.",
        "visual_indications": "UPS A front panel LED shows red warning; DP console annunciates loss of power redundancy to Controller Rack A and Field Station Group 1."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Control Power",
        "bridge_action": "Contact ETO / Chief Engineer to inspect UPS A equipment room; confirm UPS B is operating normally on clean inverter output.",
        "thruster_mode": "Maintain Auto DP on Controller B; avoid sudden load shifts.",
        "safety_zone_advisory": "If vessel is conducting critical diving or heavy lift, suspend operation and evaluate safe termination."
      },
      "root_cause_analysis": [
        "Degraded internal lead-acid battery cell in UPS A string causing high internal resistance and DC voltage collapse under load.",
        "AC rectifier input breaker tripped due to transient upstream switchboard surge.",
        "Inverter SCR thyristor failure forcing automatic transfer to maintenance/static bypass line."
      ],
      "troubleshooting_steps": [
        "Check input AC voltage, DC battery bus voltage, and output AC voltage on UPS A control screen.",
        "Verify static bypass switch has engaged and provides clean, synchronized utility power to DP rack A without interruption.",
        "Measure individual 12V battery block terminal voltages across the battery string to find dead cells.",
        "Ensure UPS B room temperature and ventilation fans are functional to avoid common-mode thermal tripping."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.3.4 Uninterruptible Power Supplies (UPS)",
          "reference_text": "Each DP controller and essential sensor suite must be powered from independent UPS systems with a minimum backup duration of 30 minutes."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 4.3 Control Power Independence",
          "reference_text": "A failure in a UPS battery or inverter must transfer seamlessly to static bypass without generating voltage transients that reset industrial computers."
        }
      ]
    },
    {
      "id": "DP-SCEN-013",
      "title": "Artemis Microwave Tracking Line-of-Sight Loss During Cargo Operations",
      "keywords": [
        "artemis tracking unlock",
        "microwave line of sight",
        "crane cargo blockage",
        "artemis unlock",
        "relative prs"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1402 ARTEMIS TRACKING UNLOCKED",
          "MT: ALM_ARTEMIS_SIGNAL_LOST",
          "Navis: PRS_ARTEMIS_SEARCH"
        ],
        "alarm_text": "Artemis Mobile Station Lost Signal Lock; Antenna Hunting.",
        "visual_indications": "Artemis range and bearing indicators freeze on DP console; raw data flag invalid; antenna starts rotating in continuous search scan."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Relative PRS",
        "bridge_action": "Contact platform crane operator via VHF; pause container transfer directly between vessel antenna mast and platform fixed antenna.",
        "thruster_mode": "Auto DP maintained via DGNSS and CyScan / RadaScan. Ensure Artemis is de-selected from DP mathematical weighting.",
        "safety_zone_advisory": "Ensure vessel holds position outside crane swing radius until tracking is restored."
      },
      "root_cause_analysis": [
        "Heavy cargo container hoisted by offshore platform crane physically intercepted the line-of-sight microwave path between mobile and fixed units.",
        "Azimuth tracking servo clutch slipped due to high relative angular rate during rapid vessel roll in heavy sea.",
        "Fixed station antenna power interrupted or switched to backup frequency channel on platform."
      ],
      "troubleshooting_steps": [
        "Check clear line-of-sight to the fixed Artemis unit on the rig platform.",
        "Engage manual antenna steering mode on Artemis control unit to point antenna directly at rig coordinates.",
        "Verify signal frequency channel and operating code pair match the fixed station setup.",
        "Check RF transmitter output power and cable connection to microwave horn."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.4.5 Microwave Systems",
          "reference_text": "Microwave relative positioning systems require uninterrupted line-of-sight. The risk of obstruction by crane operations must be managed via operating procedures."
        },
        {
          "source_doc": "MTS TECHOP ODP 08",
          "section_or_chapter": "Section 5.3 Artemis Operational Constraints",
          "reference_text": "Artemis antenna unlock events must be prevented from transferring step-position jumps into the active DP observer filter."
        }
      ]
    },
    {
      "id": "DP-SCEN-014",
      "title": "Taut Wire Clump Weight Dragging & Tension Limit Exceedance",
      "keywords": [
        "taut wire drag",
        "clump weight lost",
        "wire angle limit",
        "inclinometer error",
        "soft seabed"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 1503 TAUT WIRE 1 ANGLE > 8 DEG",
          "MT: ALM_TW1_TENSION_LIMIT",
          "Navis: TW_SEABED_SLIP"
        ],
        "alarm_text": "Taut Wire Tension Error; Wire Angle Approaching Mechanical Limit (9.5 deg).",
        "visual_indications": "Taut Wire calculated position drifts continuously in direction of subsea current; tension gauge fluctuates erratically; A-frame boom angle warning alarm."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Reference System Warning",
        "bridge_action": "Alert deck crew and subsea team; ensure personnel stand clear of taut wire moonpool / deck launch area.",
        "thruster_mode": "Reject Taut Wire from DP weighting immediately to prevent DP from following the dragged clump weight.",
        "safety_zone_advisory": "Verify clump weight is not dragging across subsea pipelines, wellheads, or umbilical cables."
      },
      "root_cause_analysis": [
        "Strong bottom currents acting against taut wire clump weight placed on soft, sloped mud seabed.",
        "Vessel operational excursion exceeded available wire pay-out angle without wire payout winch rendering.",
        "Hydraulic tensioner compensator valve stuck, causing high wire tension and lifting weight off bottom."
      ],
      "troubleshooting_steps": [
        "Initiate winch recovery sequence to raise clump weight 10 meters off seabed.",
        "Inspect wire rope condition for bird-caging, kinks, or broken strands near gimbal head sheaves.",
        "Check hydraulic tensioning unit pressure and accumulator nitrogen pre-charge.",
        "Reposition vessel slightly or select a firmer seabed drop target coordinates before re-lowering weight."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.4.6 Taut Wire Systems",
          "reference_text": "Taut wire systems are vulnerable to clump weight dragging in deep water, soft bottom conditions, and heavy currents. Maximum wire angle should not exceed 10 degrees."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 6.3 Mechanical Reference Systems",
          "reference_text": "Taut wire sensors must incorporate automated limit detection to reject coordinates when wire angles approach mechanical gimbal stops."
        }
      ]
    },
    {
      "id": "DP-SCEN-015",
      "title": "Sea Chest Suction Marine Growth Blockage (Thruster Cooling De-Rating)",
      "keywords": [
        "sea chest blockage",
        "thruster cooling failure",
        "thruster de rating",
        "high temp alarm",
        "common mode cooling"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 3205 THRUSTER 1 & 2 DRIVE HIGH TEMP",
          "MT: ALM_COOLING_FLOW_LOW",
          "Navis: THR_THERMAL_DERATE"
        ],
        "alarm_text": "Low Sea Water Cooling Pressure; Variable Frequency Drive (VFD) Heat Exchanger Temperature High.",
        "visual_indications": "Thrusters 1 and 2 maximum available thrust automatically de-rates from 100% to 40% on DP console; cooling water pressure gauge drops to 0.8 bar."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Post-Worst Case Failure Capability Degraded",
        "bridge_action": "Inform Chief Engineer immediately; verify whether backup sea chest suction can be lined up; check environmental loads against reduced thruster capacity.",
        "thruster_mode": "Maintain Auto DP; reduce vessel heading relative to wind to minimize required station-keeping thrust.",
        "safety_zone_advisory": "If thermal de-rating forces total thrust below environmental holding capability, initiate controlled departure from 500m zone."
      },
      "root_cause_analysis": [
        "Sea chest strainer grates clogged by massive jellyfish swarm, plastic debris, or heavy barnacle infestation in tropical waters.",
        "Dual cooling water loop cross-connection open, allowing single strainer blockage to starve multiple thruster heat exchangers.",
        "Auxiliary sea water circulating pump cavitation or impeller loss."
      ],
      "troubleshooting_steps": [
        "Engine room personnel must switch suction from low sea chest to high sea chest (or vice versa).",
        "Start standby sea water cooling pump on isolated emergency electrical section.",
        "Open sea chest blow-back compressed air or steam injection valve to clear foreign matter from external intake grid.",
        "Monitor VFD thyristor / IGBT temperatures until they return below 65 deg C and verify DP thrust limits restore."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 3.6 Auxiliary Systems - Cooling Water",
          "reference_text": "Cooling systems for thrusters and generators must be physically segregated so that a single clogged sea chest cannot affect redundant equipment groups."
        },
        {
          "source_doc": "MTS TECHOP ODP 14",
          "section_or_chapter": "Cross-Connections in DP Vessel Auxiliary Systems",
          "reference_text": "Shared sea water cooling loops represent an unanalyzed common-cause failure mode capable of defeating Class 2 and Class 3 redundancy."
        }
      ]
    },
    {
      "id": "DP-SCEN-016",
      "title": "Thruster Drive Feedback Discrepancy (Azimuth Steering Angle Error)",
      "keywords": [
        "azimuth angle error",
        "steering feedback disagreement",
        "hydraulic steering failure",
        "hunting thruster",
        "thrust vector error"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 3108 AZIMUTH 2 ANGLE FEEDBACK ERROR",
          "MT: ALM_AZ2_STEERING_FAULT",
          "Navis: THR2_DIR_MISMATCH"
        ],
        "alarm_text": "Azimuth 2 Command / Feedback Difference > 10 deg for > 3 Seconds; Thruster Direction Frozen.",
        "visual_indications": "DP displays red vector error on Azimuth 2; thruster fails to track heading command and remains pointed at 180 degrees while command is 240 degrees."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Degraded Propulsion Redundancy",
        "bridge_action": "Inform Bridge Team; observe vessel position drift; prepare for manual intervention on thruster panel.",
        "thruster_mode": "DP system will automatically de-rate or stop allocation to the non-tracking azimuth thruster. If DP does not isolate unit, reduce azimuth thrust to zero manually from console.",
        "safety_zone_advisory": "Hold station on remaining thrusters; confirm post-failure capability exceeds current environmental load."
      },
      "root_cause_analysis": [
        "Steering hydraulic proportional valve solenoid coil burned out or pilot filter blocked.",
        "Dual resolver / absolute encoder feedback shaft coupling slipped on azimuth steering gear column.",
        "VFD steering motor drive tripped on overtorque or phase imbalance."
      ],
      "troubleshooting_steps": [
        "Switch Azimuth 2 steering hydraulic pump from Pump 1 to Pump 2 locally in steering gear room.",
        "Inspect absolute feedback encoder mounting flange for physical play or loose locking collar screws.",
        "Check 4-20mA steering angle command and feedback signals at terminal strip inside local thruster interface cabinet (TIC).",
        "Verify oil level and filter delta-P indicator on thruster steering hydraulic power pack."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 4.3.2 Azimuth Thrusters",
          "reference_text": "Failure of azimuth steering control must result in predictable fail-as-is or automatic shutdown to avoid inducing violent uncommanded yaw moments."
        },
        {
          "source_doc": "DNV-RP-E306",
          "section_or_chapter": "Section 7.2 Thruster Control Systems",
          "reference_text": "Feedback loops for both thrust magnitude and steering angle must be independently monitored by dual sensor channels with discrepancy detection."
        }
      ]
    },
    {
      "id": "DP-SCEN-017",
      "title": "Kongsberg K-Pos Controller A Watchdog Hardware Stall (Bumpless Transfer)",
      "keywords": [
        "kongsberg watchdog",
        "controller a stall",
        "bumpless transfer",
        "cmotion failure",
        "controller freeze"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "K-Pos: 5002 DPU A WATCHDOG EXPIRED",
          "K-Pos: 5003 BUMPLESS TRANSFER TO DPU B COMPLETE",
          "MT: N/A",
          "Navis: N/A"
        ],
        "alarm_text": "Controller A Execution Halted; Standby Controller B Assumed Master Control.",
        "visual_indications": "Master indication LED shifts from Controller A to Controller B on maintenance mimic; momentary flash of yellow alarm on operator screen; vessel position remains rock-solid."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Loss of DP Controller Redundancy",
        "bridge_action": "Inform Bridge Team and Superintendent; verify on DP maintenance page that Controller B is healthy and actively executing control loops.",
        "thruster_mode": "Maintain Auto DP on Controller B. Do NOT attempt to reboot or restart Controller A while vessel is actively performing critical operations.",
        "safety_zone_advisory": "Inform client and OIM that DP control redundancy is running in single-channel mode."
      },
      "root_cause_analysis": [
        "Hardware processor memory parity check exception or motherboard chipset crash on Controller A SBC (Single Board Computer).",
        "Infinite loop in serial driver handling corrupted telegram from external sensor.",
        "Local 5V / 12V DC power regulator module thermal trip inside DPU rack A."
      ],
      "troubleshooting_steps": [
        "Inspect DPU rack diagnostic LEDs (check RUN, STOP, ERROR, and WATCHDOG LEDs on Controller A CPU card).",
        "Review system event log files via engineering maintenance terminal to locate the exact fault stack trace.",
        "Verify that Controller B maintains synchronized communication with all field stations and operator terminals.",
        "Plan controlled reboot of Controller A only after vessel has exited critical safety envelope and is in open water."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 103",
          "section_or_chapter": "Section 3.2 Dynamic Positioning Control Systems",
          "reference_text": "In DP-2 and DP-3 systems, transfer of control between redundant processing units must be automatic, seamless, and achieve bumpless handover of thruster commands."
        },
        {
          "source_doc": "MTS TECHOP ODP 02",
          "section_or_chapter": "Section 2 - DP Control System Architecture",
          "reference_text": "Hardware watchdog circuits must ensure that software execution lockup triggers immediate de-energization of bus master relays to allow the standby unit to take control without glitch."
        }
      ]
    },
    {
      "id": "DP-SCEN-018",
      "title": "Marine Technologies (MT) Dual Net-1 / Net-2 Ring Topology Interruption",
      "keywords": [
        "mt net break",
        "ethernet ring timeout",
        "bridge mate comms",
        "wago io fault",
        "fiber optic break"
      ],
      "symptoms_and_alarms": {
        "alarm_codes": [
          "MT: ALM_NET1_RING_OPEN",
          "MT: ALM_NET2_SWITCH_OFFLINE",
          "K-Pos: N/A",
          "Navis: N/A"
        ],
        "alarm_text": "Network Ring Broken Between Bridge Switch 1 and Engine Room Node 2; Single Ring Redundancy Remaining.",
        "visual_indications": "Yellow network warning icon appears on MT Bridge Mate operator terminal; topology view highlights red broken link between Switch 1 and Switch 2."
      },
      "immediate_safety_action": {
        "asog_status": "YELLOW - Network Redundancy Degraded",
        "bridge_action": "Notify ETO and Chief Engineer; dispatch technician to check network cabinet status.",
        "thruster_mode": "Maintain Auto DP; system is currently operating normally over the self-healing ring path, but further network damage will cause communication loss to field nodes.",
        "safety_zone_advisory": "Avoid starting hot work or cable pulling in machinery spaces where DP network conduits run."
      },
      "root_cause_analysis": [
        "Physical damage or severed fiber optic patch cable in cable tray due to mechanical work in engine room.",
        "Managed industrial switch 24V DC auxiliary power supply fuse blown.",
        "Optical transceiver SFP module failure on port 7 of Switch 2."
      ],
      "troubleshooting_steps": [
        "Open the MT Network Diagnostic topology page on the operator station to pinpoint the exact node and port showing link down.",
        "Inspect the fiber optic cable run and optical termination junction boxes in the designated fire zone.",
        "Measure optical power using an optical power meter (verify dBm attenuation is within specifications).",
        "Verify 24V DC dual feed power supplies at both switch locations."
      ],
      "evidence_citations": [
        {
          "source_doc": "IMCA M 166",
          "section_or_chapter": "Section 4.1 Industrial Data Networks",
          "reference_text": "Self-healing ring network topologies must recover communication within less than 50 milliseconds upon single link sever without interrupting DP thruster allocation cycles."
        },
        {
          "source_doc": "MTS TECHOP ODP 02",
          "section_or_chapter": "Section 4 - Fault Tolerant Network Topologies",
          "reference_text": "Class rules require that redundant network channels follow physically separated cable routes through different fire zones wherever practicable."
        }
      ]
    },
    {
      "id": "DP-SCEN-019",
      "title": "Loss of Two Relative Position References (CyScan & RadaScan Failed Simultaneously)",
      "keywords": [
        "cyscan and radascan failed",
        "two reference missing",
        "loss of two prs",
        "size scan and 100 scan",
        "two references lost",
        "relative prs failure",
        "500m zone prs loss"
      ],
      "symptoms": [
        "Simultaneous 'PRS Dropout' alarms for CyScan and RadaScan on DP Console",
        "Kalman filter innovation rejected on relative sensors",
        "Vessel operating on absolute GNSS references only"
      ],
      "immediate_safety_action": "IMMEDIATE ASOG YELLOW / AMBER (ADVISORY) STATUS. If remaining PRS are inadequate or voting fails inside 500m zone, trigger ASOG RED. Inform Master, DPO, and ECR. Contact Rig OIM immediately and suspend cargo/crane transfers. Verify remaining references (DGPS 1 & DGPS 2, or HiPAP). Prepare manual joystick takeover and prepare to abort to safe standby if station-keeping degrades.",
      "root_cause_analysis": "Simultaneous loss of two independent relative position reference systems typically stems from: (1) Common line-of-sight blockage caused by vessel heading shift placing rig structure behind ship cranes/masts; (2) Rapid environmental squall with blinding fog/heavy spray (dropping laser CyScan) coupled with rig transponder battery expiration (dropping RadaScan); or (3) Power/Ethernet failure on the bridge relative PRS interface console.",
      "troubleshooting_steps": [
        "1. OPERATIONAL: Check CAMO matrix and vessel ASOG immediately. Transition vessel alert status to YELLOW/AMBER.",
        "2. CONTACT RIG: Instruct offshore platform to halt all lifting operations and crane swings over vessel deck.",
        "3. CHECK ABSOLUTE PRS: Verify DGPS-1 and DGPS-2 health, PDOP (< 3.0), satellite count (> 8), and correction links (Veripos/Fugro). Confirm no ionospheric scintillation.",
        "4. CYSCAN INSPECTION: Check CyScan console. Verify optical cylinder cleanliness (salt crust / grease). Verify rotor rotation and tilt angle feedback.",
        "5. RADASCAN INSPECTION: Check RadaScan console for 'Transponder No Reply'. Query rig if transponder battery pack has expired or if antenna was knocked out of alignment.",
        "6. NETWORK / POWER CHECK: Verify 24V DC auxiliary power supply and Ethernet/RS-422 serial links to both sensor processing computers on bridge."
      ],
      "evidence_citations": [
        "IMCA M 103 (Rev 4) Section 3.4 'Position Reference Systems': DP-2 requires at least 3 independent references simultaneously online, with at least two based on different physical principles.",
        "MTS TECHOP ODP 12 'CAMO and ASOG': A loss of redundancy in position references constitutes a mandatory Yellow advisory trigger.",
        "ABS Guide for Dynamic Positioning Systems (2024) Section 2-3.3: Redundancy verification and automatic alarm threshold criteria."
      ]
    },
    {
      "id": "DP-SCEN-020",
      "title": "CyScan Service Level Diagnosis: Rotor Motor Rotating Normally but No Targets Acquired",
      "keywords": [
        "cyscan motor rotating",
        "size scan motor rotating",
        "rotor rotating no target",
        "cyscan spinning no target",
        "size scan running not tracking",
        "motor is rotating and all other parts are working",
        "cyscan service issue"
      ],
      "symptoms": [
        "CyScan sensor head is observed rotating smoothly at 1 to 5 Hz",
        "Console reports '0 Targets', 'Target Signal Low', or 'Search Mode Timeout'",
        "No raw returns or bearing lock achieved"
      ],
      "immediate_safety_action": "Inform DPO that CyScan is inoperative. In DP console, deselect CyScan from active voting pool to prevent Kalman filter spikes. Switch DP operation to secondary PRS (RadaScan / DGNSS). Inspect sensor hardware safely.",
      "root_cause_analysis": "When the rotor motor is running, the main motor drive, belt, and DC drive power rail are intact. The failure to detect targets originates from either: (A) Optical transmission blockage (salt/soot on glass cylinder, internal fogging); (B) Pitch/tilt elevation servo jammed at extreme angle; (C) Laser transceiver diode failure or blown transmitter fuse; (D) Rotor optical azimuth encoder/zero-index failure; (E) Worn slip ring data contacts; or (F) Active blanking sector or line-of-sight occlusion.",
      "troubleshooting_steps": [
        "1. OPTICAL GLASS CYLINDER: Clean the 360-degree cylindrical glass window using 99% isopropyl alcohol and lint-free optical lens wipes. Check for scratches or diesel soot film causing laser beam diffusion.",
        "2. TILT ELEVATION HOMING: Check the CyScan software console for pitch/tilt feedback. If stuck at +20\u00b0 or -20\u00b0, the laser is shooting over or under the target prisms. Power cycle sensor head to observe mechanical homing sequence.",
        "3. LASER EMISSION CHECK: Inspect the rotating aperture using an infrared card or smartphone camera (which detects 905nm IR pulses). Look for the 'TX_LASER' diagnostic LED on the internal processor board.",
        "4. AZIMUTH ZERO-INDEX ENCODER: If the rotor spins but the optical zero-reference sensor fails, bearing angles cannot be calculated and returns are rejected. Clean optical encoder disk and verify sensor alignment.",
        "5. INTERNAL SLIP RING: Check the gold-wire slip ring assembly connecting rotating head to the base unit. Worn contacts allow DC motor power through but degrade high-speed laser pulses.",
        "6. TARGET PRISM & BLANKING CHECK: Check rig target prism cluster. Ensure vessel has not turned into an active software blanking sector."
      ],
      "evidence_citations": [
        "Guidance Marine CyScan Mk4 Service Manual, Section 6 'Optical Head Maintenance & Component Isolation'",
        "IMCA M 103 Section 4.5 'Laser Position Reference Maintenance Guidelines'",
        "Wartsila Guidance Marine Technical Bulletin TB-CYS-014 'Slip Ring & Optical Aperture Diagnostics'"
      ]
    }
  ],
  "regulations_and_standards": {
    "imca_guidelines": {
      "imca_m_103": {
        "title": "Guidelines for the Design and Operation of Dynamically Positioned Vessels",
        "revision": "Rev. 4 (and subsequent updates)",
        "scope": "The global maritime benchmark for DP vessel design, operational procedures, equipment classes, and risk mitigation.",
        "key_mandates": [
          "Defines minimum equipment requirements for DP Class 1, Class 2, and Class 3.",
          "Mandates independent position reference systems (minimum 3 PRS of at least 2 different physical principles for DP-2/3).",
          "Requires formal documentation: DP Operations Manual, FMEA, FMEA Proving Trials, Annual DP Trials, and Capability Plots.",
          "Establishes ASOG (Activity Specific Operating Guidelines), CAMO (Critical Activity Mode), and TAM (Task Appropriate Mode) operational matrices."
        ]
      },
      "imca_m_117": {
        "title": "The Training and Experience of Key DP Personnel",
        "revision": "Rev. 2",
        "scope": "Comprehensive standard defining competency requirements, simulator training, sea-time recording, and continuous professional development for DPOs, technical staff, and vessel masters.",
        "key_mandates": [
          "Minimum certification paths for Dynamic Positioning Operators (NI / IMCA scheme).",
          "Mandatory vessel-specific familiarization and structured continuous DP logbook recording.",
          "Competency matrices for Electrical Technical Officers (ETOs) and Marine Engineers operating high-voltage DP switchboards."
        ]
      },
      "imca_m_166": {
        "title": "Guidance on Failure Modes and Effects Analyses (FMEAs)",
        "revision": "Rev. 1",
        "scope": "Detailed framework for identifying potential failure modes in DP systems and verifying that no single fault can exceed the vessel's Worst Case Failure Design Intent (WCFDI).",
        "key_mandates": [
          "Rigorous failure mode analysis across generators, switchboards, UPS, thrusters, cooling loops, fuel supply, control networks, and sensors.",
          "Validation of Worst Case Failure (WCF) and Worst Case Failure Design Intent (WCFDI).",
          "Verification through physical proving trials without relying on theoretical assumptions or mathematical simulations alone."
        ]
      },
      "imca_m_220": {
        "title": "Guidance on DP Station Keeping Incident Reporting",
        "revision": "Current edition",
        "scope": "Standardized scheme for recording, classifying, investigating, and reporting loss of position or degraded DP integrity incidents across the global offshore fleet.",
        "key_mandates": [
          "Categorization into: DP Incident (loss of position/heading), DP Undesired Event (degraded redundancy without excursion), and DP Observation.",
          "Root cause analysis taxonomy (human error, technical component failure, environmental overload, procedural gap).",
          "Mandatory industry sharing to drive global safety flashes and collective operational learning."
        ]
      }
    },
    "mts_techops": {
      "overview": "Marine Technology Society (MTS) Technical and Operational Guidance (TECHOP) documents provide practical, engineering-level requirements for DP vessel owners, designers, and operators.",
      "documents": [
        {
          "id": "TECHOP_ODP_01",
          "title": "Blackout Recovery",
          "summary": "Mandates automated and manual recovery procedures following total or partial power collapse, setting hard time limits (e.g. power restoration to thrusters within 45 seconds)."
        },
        {
          "id": "TECHOP_ODP_02",
          "title": "Industrial Ethernet in DP Systems",
          "summary": "Establishes cybersecurity, broadcast suppression, deterministic latency, and physical segregation criteria for DP networks."
        },
        {
          "id": "TECHOP_ODP_03",
          "title": "FMEA Testing & Proving Trials",
          "summary": "Outlines non-destructive and destructive open-sea proving trial procedures to physically demonstrate fault isolation and bumpless transfer."
        },
        {
          "id": "TECHOP_ODP_04",
          "title": "Thruster Reliability and Drive Off",
          "summary": "Analysis of thruster pitch and speed control loops to guarantee that no single failure leads to uncontrolled runaway thrust."
        },
        {
          "id": "TECHOP_ODP_05",
          "title": "Sensor Selection & Fault Tolerance",
          "summary": "Rules for gyrocompass, wind sensor, and MRU voting algorithms, rejection filtering, and sensor geographical placement."
        },
        {
          "id": "TECHOP_ODP_06",
          "title": "Annual DP Trials Programs",
          "summary": "Standardized yearly re-verification of all safety-critical failure modes and interlocks over a rolling 5-year testing cycle."
        },
        {
          "id": "TECHOP_ODP_07",
          "title": "Cross-Connections in Power & Auxiliary Systems",
          "summary": "Identifies hidden failure paths across shared fuel, cooling water, compressed air, and electrical bus-ties that breach redundancy."
        },
        {
          "id": "TECHOP_ODP_08",
          "title": "Position Reference System Selection and Management",
          "summary": "Guidelines for achieving true physical independence between surface satellite (GNSS) and subsea/relative reference systems."
        },
        {
          "id": "TECHOP_ODP_09",
          "title": "DP Operations Guidance (CAMO / ASOG / TAM)",
          "summary": "Standardizes decision-support matrices: Green (Normal), Yellow (Degraded Advisory), and Red (Emergency Abort Action)."
        },
        {
          "id": "TECHOP_ODP_10",
          "title": "DP Power Plant Common Cause Failures",
          "summary": "Engineering mitigations for common-mode governor, AVR, fuel rack, and excitation faults across diesel generator sets."
        },
        {
          "id": "TECHOP_ODP_11",
          "title": "Advanced Generator Protection Systems (AGPS)",
          "summary": "Fast generator tripping and fault ride-through protection to prevent healthy generators from collapsing during a bus fault."
        },
        {
          "id": "TECHOP_ODP_12",
          "title": "Critical Activity Mode (CAM) in FMEAs",
          "summary": "Ensures the FMEA explicitly defines and proves the precise vessel configuration required for CAM execution."
        },
        {
          "id": "TECHOP_ODP_13",
          "title": "DP System Capability Assessment",
          "summary": "Defines methods for calculating polar thrust capability plots under intact, worst-case single failure, and degraded states."
        },
        {
          "id": "TECHOP_ODP_14",
          "title": "Control Power Integrity and DC UPS Systems",
          "summary": "Battery monitoring, static bypass design, and fault isolation in 24V DC / 110V AC control distribution circuits."
        },
        {
          "id": "TECHOP_ODP_15",
          "title": "Emergency Response and Drift-Off Contagion Control",
          "summary": "Bridge team decision protocols, emergency disconnect sequencing, and safe departure maneuvering during sudden station loss."
        }
      ]
    },
    "classification_notations": {
      "dnv": {
        "standard": "DNV Rules for Classification of Ships - Part 6 Chapter 7 (Dynamic Positioning)",
        "classes": [
          {
            "notation": "DYNPOS-AUTS (DP-1)",
            "description": "Non-redundant dynamic positioning system with centralized manual backup control. Position loss will occur upon single component failure."
          },
          {
            "notation": "DYNPOS-AUTR (DP-2)",
            "description": "Redundant dynamic positioning system where no single failure in active components (generators, thrusters, switchboards, controllers) will cause position loss. Requires dual controllers and dual bus configuration."
          },
          {
            "notation": "DYNPOS-AUTRO (DP-3)",
            "description": "Highest redundancy class. Single failure includes total loss of any single compartment due to fire or flood. Requires physical A-60 bulkhead segregation, independent backup control room, and separated cable/pipe routing."
          }
        ]
      },
      "abs": {
        "standard": "ABS Guide for Dynamic Positioning Systems",
        "classes": [
          {
            "notation": "DPS-1",
            "description": "Single-system configuration without redundancy requirements. Manual intervention required upon failure."
          },
          {
            "notation": "DPS-2",
            "description": "Redundant control, power, and thruster systems ensuring station keeping integrity is maintained after any single electrical or mechanical failure."
          },
          {
            "notation": "DPS-3",
            "description": "Full physical segregation of redundant equipment groups into fire- and water-tight divisions, including an isolated backup dynamic positioning control station."
          }
        ]
      }
    }
  }
};
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DP_KNOWLEDGE;
  }
  if (typeof window !== 'undefined') {
    window.DP_KNOWLEDGE = DP_KNOWLEDGE;
  }
  if (typeof global !== 'undefined') {
    global.DP_KNOWLEDGE = DP_KNOWLEDGE;
  }
})(this);
