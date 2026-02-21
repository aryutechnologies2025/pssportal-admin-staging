import z from "zod";

export const EmployeeSchema = (id) => z.object({
    profile_image: id ? z
        .union([z.instanceof(File), z.string()])
        .refine((val) => val instanceof File || (typeof val === "string" && val.length > 0), {
            message: "Profile image is required",
        }).optional() : z
        .union([z.instanceof(File), z.string()])
        .refine((val) => val instanceof File || (typeof val === "string" && val.length > 0), {
            message: "Profile image is required",
        }),

    offical_email: z.string().email({ message: "Invalid official email format" }),
    password: id
        ? z.string().optional()
        : z.string().min(6, { message: "Password must be at least 6 characters" }),
    full_name: z.string().min(1, { message: "Full name is required" }),
    status: z.enum(["0", "1"]).optional(),
    role_id: z
        .string()
        .min(1, { message: "Role is required" }),
    branch_id: z
        .string()
        .min(1, { message: "Branch is required" }),

    aadhaar_no: z.string().length(12, { message: "Aadhaar number must be 12 digits" }).regex(/^\d{12}$/, { message: "Aadhaar number must be numeric" }),
    pan_no: z.string().length(10, { message: "PAN number must be 10 characters" }).regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, { message: "PAN number must follow the format ABCDE1234F" }),
    father_name: z.string().min(1, { message: "Father's name is required" }),
    mother_name: z.string().min(1, { message: "Mother's name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    phone_no: z.string().length(10, { message: "Phone number must be 10 digits" }).regex(/^\d{10}$/, { message: "Phone number must be numeric" }),
    qualification: z.string().min(1, { message: "Qualification is required" }),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of birth is Required" }),
    gen_employee_id: z.string().min(1, { message: "Employee Id is required" }),
    date_of_joining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of joining is Required" }),

    marital_status: z
        .string()
        .nullable()
        .transform(val => val ?? "")
        .refine(val => val.length > 0, {
            message: "Marital status is required",
        }),

    spouse_name: z
        .string()
        .nullable()
        .transform(val => val ?? ""),

    spouse_name: z.string().optional(),
    local_address: z.string().min(1, { message: "Local address is required" }),
    permanent_address: z.string().min(1, { message: "Permanent address is required" }),

    //Salary information
    salary_amount: z
        .coerce
        .number({
            required_error: "Salary is required",
            invalid_type_error: "Salary must be a number",
        })
        .positive("Salary must be a positive number"),

    salary_basis: z.string().min(1, { message: "Salary Basis is required" }),
    effective_date: z.string().min(1, { message: "Effective Date is required" }),
    payment_type: z.string().min(1, { message: "Payment Type is required" }),



    // skills: z.array(z.string().min(1, { message: "Skill cannot be empty" })).min(1, { message: "At least one skill is required" }),
    skills: z.array(z.string().optional()),

    // Bank information
    bank_name: z.string().min(1, { message: "Bank name is required" }),
    bank_branch: z.string().min(1, { message: "Bank branch is required" }),
    bank_account_no: z.string().min(10, { message: "Bank account number must be at least 10 digits" }),
    ifsc_code: z.string().min(1, { message: "IFSC code must be provided" }),

    emergencyContacts: z
        .array(
            z.object({
                name: z.string().min(1, { message: "Name is required" }),
                relation: z.string().min(1, { message: "Relation is required" }),
                phone: z.string().length(10, { message: "Phone number must be 10 digits" }).regex(/^\d{10}$/, { message: "Phone number must be numeric" }),
            })
        )
        .min(1, { message: "At least one contact is required" }),

    verifications: z.array(
        z.object({
            type: z.string(),
            status: z.string(),
        })
    ).optional(),
    documents: z
        .array(
            z.object({
                title: z.string().min(1, "Document title is required"),

                files: z.array(
                    z.object({
                        file: z
                            .any() // ← accept anything
                            .optional(),
                        existing: z.boolean().optional(),
                    })
                )
            })
        )
        .optional(),

}).refine(
    (data) =>
        data.marital_status !== "married" ||
        (data.spouse_name && data.spouse_name.trim().length > 0),
    {
        message: "Spouse name is required when marital status is Married",
        path: ["spouse_name"],
    }
);


export const EducationItemSchema =
    z.object({
        school_name: z.string().min(1, { message: "Degree is required" }),
        department_name: z.string().min(1, { message: "Institute name is required" }),
        year_of_passing: z
            .coerce
            .number({ required_error: "Year of passing is required" })
            .min(1900, { message: "Year of passing must be valid" })
            .max(new Date().getFullYear(), {
                message: "Year of passing cannot be in the future",
            }),

    }
    );
export const EmployeeEducationSchema = z.array(EducationItemSchema);

export const ExperienceItemSchema = z.object({
    job_title: z.string().min(1, "Job title is required"),
    company_industry: z.string().min(1, "Company industry is required"),
    company_name: z.string().min(1, "Company name is required"),
    previous_salary: z.coerce.number({
        required_error: "Salary is required",
        invalid_type_error: "Salary must be a number",
    })
        .positive("Previous Salary must be a positive number"),
    from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
    to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
    responsibilities: z
        .array(z.string().min(1))
        .min(1, "At least one responsibility is required"),
    verification_documents: z.array(z.object({
        payslip1: z.number().optional(),
        payslip2: z.number().optional(),
        payslip3: z.number().optional(),
        appointment_letter: z.number().optional(),
        experience_letter: z.number().optional(),
    })).optional(),
});
export const EmployeeExperienceSchema = z.array(ExperienceItemSchema);