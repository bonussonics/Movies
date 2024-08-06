package models

type Movie struct {
	ID          int      `json:"id" gorm:"primaryKey"`
	Title       string   `json:"title"`
	ReleaseDate string   `json:"release_date"`
	RunTime     int      `json:"runtime"`
	MPAARating  string   `json:"mpaa_rating"`
	Description string   `json:"description"`
	Image       string   `json:"image"`
	CreatedAt   string   `json:"created_at"`
	UpdatedAt   string   `json:"updated_at"`
	Genres      []*Genre `json:"genres,omitempty"`
	GenresArray []int    `json:"genres_array,omitempty"`
}

type Genre struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	Genre     string `json:"genre"`
	Checked   bool   `json:"Checked"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
